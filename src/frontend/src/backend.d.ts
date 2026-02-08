import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Job {
    id: JobId;
    title: string;
    published: boolean;
    description: string;
    employmentType: string;
    employer: Principal;
    skills: Array<string>;
    location: string;
}
export type Time = bigint;
export type MessageId = bigint;
export interface Application {
    id: ApplicationId;
    status: ApplicationStatus;
    createdAt: Time;
    jobId: JobId;
    portfolioUrl?: string;
    message: string;
    candidate: Principal;
}
export interface Message {
    id: MessageId;
    content: string;
    applicationId: ApplicationId;
    sender: Principal;
    timestamp: Time;
}
export type JobId = bigint;
export type ApplicationId = bigint;
export interface UserProfile {
    name: string;
    description: string;
    accountType: AccountType;
    companyName: string;
    skills?: Array<string>;
    location: string;
}
export enum AccountType {
    employer = "employer",
    candidate = "candidate"
}
export enum ApplicationStatus {
    hired = "hired",
    submitted = "submitted",
    interview = "interview",
    rejected = "rejected",
    reviewed = "reviewed"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    applyToJob(jobId: JobId, message: string, portfolioUrl: string | null): Promise<ApplicationId>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createAccount(accountType: AccountType, name: string): Promise<void>;
    createJob(title: string, description: string, location: string, employmentType: string, skills: Array<string>): Promise<JobId>;
    deleteJob(jobId: JobId): Promise<void>;
    getApplicationsByCandidate(candidate: Principal): Promise<Array<Application>>;
    getApplicationsByJob(jobId: JobId): Promise<Array<Application>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getJob(jobId: JobId): Promise<Job | null>;
    getJobsByEmployer(employer: Principal): Promise<Array<Job>>;
    getMessagesByApplication(applicationId: ApplicationId): Promise<Array<Message>>;
    getProfile(user: Principal): Promise<UserProfile>;
    getPublishedJobs(): Promise<Array<Job>>;
    getTotalMembersCount(): Promise<bigint>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    searchJobs(searchTerm: string): Promise<Array<Job>>;
    sendMessage(applicationId: ApplicationId, content: string): Promise<MessageId>;
    toggleJobPublication(jobId: JobId, published: boolean): Promise<void>;
    updateApplicationStatus(applicationId: ApplicationId, status: ApplicationStatus): Promise<void>;
    updateJob(jobId: JobId, title: string, description: string, location: string, employmentType: string, skills: Array<string>): Promise<void>;
    updateProfile(skills: Array<string> | null, location: string, description: string, companyName: string): Promise<void>;
}
