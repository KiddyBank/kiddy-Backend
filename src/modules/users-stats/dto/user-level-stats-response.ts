export enum LevelStatus {
    LOCKED = 'locked',
    IN_PROGRESS = 'in_progress',
    COMPLETED = 'completed',
}

export interface LevelProgressDTO {
    id: string;
    name: string;
    icon: string;
    status: LevelStatus;
    pointsRequired: number;
    pointsEarned: number;
}

export interface UserLevelMatrixResponse {
    currentLevelId: number;
    currentLevelXp: number;
    totalXp: number;
    levels: LevelProgressDTO[];
}