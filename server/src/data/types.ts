
export type AccountRegister = {
    email: string,
    password: string
}

export type Account = {
    id?: number,
    email: string,
    password: string,
    created_at: Date,
    updated_at: Date
}

export type AccountCreate = {
    email: string,
    username: string,
    password: string,
    account_type: string
}

export type Rerponse = {
    status: number,
    message: string,
    ok: boolean,
    error?: [],
    data?: any
}

enum applicationStatus {
    PENDING = "PENDING",
    APPROVED = "APPROVED",
    REJECTED = "REJECTED"
}

enum scheduleStatus {
    REJECTED = "REJECTED",
    COMPLETED = "COMPLETED",
    CANCELLED = "CANCELLED"
}

export type ApplicationStatus = {
    id: number,
}

export type FindAccount = {
    email: string,
}