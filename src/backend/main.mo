import Map "mo:core/Map";
import Array "mo:core/Array";
import Iter "mo:core/Iter";
import Text "mo:core/Text";
import Time "mo:core/Time";
import List "mo:core/List";
import Order "mo:core/Order";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import AccessControl "authorization/access-control";
import MixinAuthorization "authorization/MixinAuthorization";
import Int "mo:core/Int";

actor {
  type JobId = Int;
  type ApplicationId = Int;
  type MessageId = Int;

  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  type AccountType = { #candidate; #employer };

  public type UserProfile = {
    accountType : AccountType;
    name : Text;
    skills : ?[Text];
    location : Text;
    description : Text;
    companyName : Text;
  };

  module UserProfile {
    public func compare(profile1 : UserProfile, profile2 : UserProfile) : Order.Order {
      Text.compare(profile1.name, profile2.name);
    };
  };

  public type Job = {
    id : JobId;
    title : Text;
    description : Text;
    location : Text;
    employmentType : Text;
    skills : [Text];
    employer : Principal;
    published : Bool;
  };

  module Job {
    public func compare(job1 : Job, job2 : Job) : Order.Order {
      Int.compare(job1.id, job2.id);
    };
  };

  public type ApplicationStatus = {
    #submitted;
    #reviewed;
    #interview;
    #rejected;
    #hired;
  };

  public type Application = {
    id : ApplicationId;
    jobId : JobId;
    candidate : Principal;
    message : Text;
    portfolioUrl : ?Text;
    status : ApplicationStatus;
    createdAt : Time.Time;
  };

  module Application {
    public func compare(app1 : Application, app2 : Application) : Order.Order {
      Int.compare(app1.id, app2.id);
    };
  };

  public type Message = {
    id : MessageId;
    applicationId : ApplicationId;
    sender : Principal;
    content : Text;
    timestamp : Time.Time;
  };

  module Message {
    public func compare(msg1 : Message, msg2 : Message) : Order.Order {
      Int.compare(msg1.id, msg2.id);
    };
  };

  let profiles = Map.empty<Principal, UserProfile>();
  let jobs = Map.empty<JobId, Job>();
  let applications = Map.empty<ApplicationId, Application>();
  let messages = Map.empty<MessageId, Message>();

  var nextJobId : JobId = 1;
  var nextApplicationId : ApplicationId = 1;
  var nextMessageId : MessageId = 1;

  // Public query - returns aggregate statistical data, no authorization needed
  public query func getTotalMembersCount() : async Nat {
    profiles.size();
  };

  // Required profile management functions
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    profiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    profiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    profiles.add(caller, profile);
  };

  public shared ({ caller }) func createAccount(accountType : AccountType, name : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can create accounts");
    };
    if (profiles.containsKey(caller)) {
      Runtime.trap("Account already exists");
    };
    let profile : UserProfile = {
      accountType;
      name;
      skills = null;
      location = "";
      description = "";
      companyName = "";
    };
    profiles.add(caller, profile);
  };

  public shared ({ caller }) func updateProfile(skills : ?[Text], location : Text, description : Text, companyName : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can update profiles");
    };
    let profile = switch (profiles.get(caller)) {
      case (null) { Runtime.trap("Profile not found") };
      case (?profile) { profile };
    };
    let updatedProfile : UserProfile = {
      accountType = profile.accountType;
      name = profile.name;
      skills;
      location;
      description;
      companyName;
    };
    profiles.add(caller, updatedProfile);
  };

  public shared ({ caller }) func createJob(title : Text, description : Text, location : Text, employmentType : Text, skills : [Text]) : async JobId {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can create jobs");
    };
    let profile = switch (profiles.get(caller)) {
      case (null) { Runtime.trap("Profile not found") };
      case (?profile) { profile };
    };
    switch (profile.accountType) {
      case (#employer) {};
      case (_) { Runtime.trap("Only employers can create jobs") };
    };
    let jobId = nextJobId;
    let job : Job = {
      id = jobId;
      title;
      description;
      location;
      employmentType;
      skills;
      employer = caller;
      published = false;
    };
    jobs.add(jobId, job);
    nextJobId += 1;
    jobId;
  };

  public shared ({ caller }) func updateJob(jobId : JobId, title : Text, description : Text, location : Text, employmentType : Text, skills : [Text]) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can update jobs");
    };
    let job = switch (jobs.get(jobId)) {
      case (null) { Runtime.trap("Job not found") };
      case (?job) { job };
    };
    if (job.employer != caller and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Only the employer who created the job can update it");
    };
    let updatedJob : Job = {
      id = jobId;
      title;
      description;
      location;
      employmentType;
      skills;
      employer = job.employer;
      published = job.published;
    };
    jobs.add(jobId, updatedJob);
  };

  public shared ({ caller }) func toggleJobPublication(jobId : JobId, published : Bool) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can change job publication status");
    };
    let job = switch (jobs.get(jobId)) {
      case (null) { Runtime.trap("Job not found") };
      case (?job) { job };
    };
    if (job.employer != caller and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Only the employer who created the job can change publication status");
    };
    let updatedJob : Job = {
      id = jobId;
      title = job.title;
      description = job.description;
      location = job.location;
      employmentType = job.employmentType;
      skills = job.skills;
      employer = job.employer;
      published;
    };
    jobs.add(jobId, updatedJob);
  };

  public shared ({ caller }) func deleteJob(jobId : JobId) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can delete jobs");
    };
    let job = switch (jobs.get(jobId)) {
      case (null) { Runtime.trap("Job not found") };
      case (?job) { job };
    };
    if (job.employer != caller and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Only the employer who created the job can delete it");
    };
    jobs.remove(jobId);
  };

  public query func getPublishedJobs() : async [Job] {
    // Public endpoint - anyone including guests can browse published jobs
    jobs.values().toArray().filter(func(job) { job.published });
  };

  public query ({ caller }) func getJobsByEmployer(employer : Principal) : async [Job] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can view employer jobs");
    };
    // Only the employer themselves or admins can see all jobs (including unpublished)
    if (caller != employer and not AccessControl.isAdmin(accessControlState, caller)) {
      // Others can only see published jobs
      return jobs.values().toArray().filter(func(job) { job.employer == employer and job.published });
    };
    jobs.values().toArray().filter(func(job) { job.employer == employer });
  };

  public query func searchJobs(searchTerm : Text) : async [Job] {
    // Public endpoint - anyone including guests can search published jobs
    jobs.values().toArray().filter(
      func(job) {
        job.published and (
          job.title.contains(#text searchTerm) or job.description.contains(#text searchTerm) or job.location.contains(#text searchTerm)
        )
      }
    );
  };

  public shared ({ caller }) func applyToJob(jobId : JobId, message : Text, portfolioUrl : ?Text) : async ApplicationId {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can apply to jobs");
    };
    let profile = switch (profiles.get(caller)) {
      case (null) { Runtime.trap("Profile not found") };
      case (?profile) { profile };
    };
    switch (profile.accountType) {
      case (#candidate) {};
      case (_) { Runtime.trap("Only candidates can apply to jobs") };
    };
    let job = switch (jobs.get(jobId)) {
      case (null) { Runtime.trap("Job not found") };
      case (?job) { job };
    };
    if (not job.published) {
      Runtime.trap("Cannot apply to unpublished job");
    };
    let applicationId = nextApplicationId;
    let application : Application = {
      id = applicationId;
      jobId;
      candidate = caller;
      message;
      portfolioUrl;
      status = #submitted;
      createdAt = Time.now();
    };
    applications.add(applicationId, application);
    nextApplicationId += 1;
    applicationId;
  };

  public shared ({ caller }) func updateApplicationStatus(applicationId : ApplicationId, status : ApplicationStatus) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can update application status");
    };
    let application = switch (applications.get(applicationId)) {
      case (null) { Runtime.trap("Application not found") };
      case (?application) { application };
    };
    let job = switch (jobs.get(application.jobId)) {
      case (null) { Runtime.trap("Job not found") };
      case (?job) { job };
    };
    if (job.employer != caller and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Only the employer who created the job can update application status");
    };
    let updatedApplication : Application = {
      id = applicationId;
      jobId = application.jobId;
      candidate = application.candidate;
      message = application.message;
      portfolioUrl = application.portfolioUrl;
      status;
      createdAt = application.createdAt;
    };
    applications.add(applicationId, updatedApplication);
  };

  public query ({ caller }) func getApplicationsByCandidate(candidate : Principal) : async [Application] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can view applications");
    };
    // Only the candidate themselves or admins can view their applications
    if (caller != candidate and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own applications");
    };
    applications.values().toArray().filter(func(application) { application.candidate == candidate });
  };

  public query ({ caller }) func getApplicationsByJob(jobId : JobId) : async [Application] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can view job applications");
    };
    let job = switch (jobs.get(jobId)) {
      case (null) { Runtime.trap("Job not found") };
      case (?job) { job };
    };
    // Only the employer who created the job or admins can view applications
    if (job.employer != caller and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Only the employer who created the job can view its applications");
    };
    applications.values().toArray().filter(func(application) { application.jobId == jobId });
  };

  public shared ({ caller }) func sendMessage(applicationId : ApplicationId, content : Text) : async MessageId {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can send messages");
    };
    let application = switch (applications.get(applicationId)) {
      case (null) { Runtime.trap("Application not found") };
      case (?application) { application };
    };
    let job = switch (jobs.get(application.jobId)) {
      case (null) { Runtime.trap("Job not found") };
      case (?job) { job };
    };
    if (caller != application.candidate and caller != job.employer and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Only the candidate or employer can send messages for this application");
    };
    let messageId = nextMessageId;
    let message : Message = {
      id = messageId;
      applicationId;
      sender = caller;
      content;
      timestamp = Time.now();
    };
    messages.add(messageId, message);
    nextMessageId += 1;
    messageId;
  };

  public query ({ caller }) func getMessagesByApplication(applicationId : ApplicationId) : async [Message] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can view messages");
    };
    let application = switch (applications.get(applicationId)) {
      case (null) { Runtime.trap("Application not found") };
      case (?application) { application };
    };
    let job = switch (jobs.get(application.jobId)) {
      case (null) { Runtime.trap("Job not found") };
      case (?job) { job };
    };
    // Only the candidate, employer, or admins can view messages
    if (caller != application.candidate and caller != job.employer and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Only the candidate or employer can view messages for this application");
    };
    messages.values().toArray().filter(func(message) { message.applicationId == applicationId });
  };

  public query ({ caller }) func getProfile(user : Principal) : async UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can view profiles");
    };
    switch (profiles.get(user)) {
      case (null) { Runtime.trap("Profile not found") };
      case (?profile) { profile };
    };
  };
};
