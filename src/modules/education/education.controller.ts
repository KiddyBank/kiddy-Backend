import { Controller, Get, Param, Query } from '@nestjs/common';
import { EducationService } from './education.service';

@Controller('education')
export class EducationController {
    constructor(private readonly educationService: EducationService) { }

    @Get('should-show')
    async getFirstActionContent(
        @Query('userId') userId: string,
        @Query('actionType') actionType: string,
    ) {
        if (!actionType) {
            return {
                message: 'Missing actionType',
            };
        }

        const content = await this.educationService.getContentForFirstAction(userId, actionType);

        if (content) {
            return {
                message: 'Please view the content before proceeding with the action.',
                content: content.content_payload
            };
        }

        return {
            message: 'Action has already been completed or no content available.',
        };
    }
}
