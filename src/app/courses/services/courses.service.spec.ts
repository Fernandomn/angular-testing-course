import {
  HttpClientTestingModule,
  HttpTestingController,
} from "@angular/common/http/testing";
import { TestBed } from "@angular/core/testing";
import { COURSES } from "./../../../../server/db-data";
import { CoursesService } from "./courses.service";

describe("CoursesService", () => {
  let coursesService: CoursesService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [CoursesService],
    });

    coursesService = TestBed.inject<CoursesService>(CoursesService);
    httpTestingController = TestBed.inject<HttpTestingController>(
      HttpTestingController
    );
  });

  it("should retrieve all courses", () => {
    coursesService.findAllCourses().subscribe((courses) => {
      expect(courses).toBeTruthy("No courses returned");
      expect(courses.length).toBe(12, "incorrect number of courses");

      const course = courses.find((course) => course.id == 12);

      expect(course.titles.description).toBe("Angular Testing Course");
    });

    const req = httpTestingController.expectOne("/api/courses");

    expect(req.request.method).toEqual("GET");

    req.flush({ payload: Object.values(COURSES) });
  });
});
