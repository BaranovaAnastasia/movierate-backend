import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post } from '@nestjs/common';
import { Review } from '@prisma/client';
import { GetCurrentUserId, Public } from 'src/common/decorators';
import { ReviewDto } from './dto';
import { ReviewService } from './review.service';

@Controller('review')
export class ReviewController {

  constructor(private reviewService: ReviewService) { }

  @Public()
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  getReviews(@Param('id') id: number): Promise<ReviewDto[]> {
    return this.reviewService.getReviews(Number(id));
  }

  @Post()
  @HttpCode(HttpStatus.OK)
  postReview(
    @GetCurrentUserId() userId: number,
    @Body() dto: ReviewDto
  ): Promise<ReviewDto[]> {
    return this.reviewService.postReview(Number(userId), dto);
  }
}
