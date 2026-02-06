export interface ValidationError {
    field: string;
    message: string;
}

export interface ProblemDetailResponse {
    type: string;
    title: string;
    status: number;
    detail: string;
    instance: string;
    errors?: ValidationError[];
}

export class ValidationFailedError extends Error {
  public readonly errors: ValidationError[];

  constructor(response: ProblemDetailResponse) {
    super(response.detail);
    this.name = 'ValidationFailedError';
    this.errors = response.errors ?? [];
  }
}
