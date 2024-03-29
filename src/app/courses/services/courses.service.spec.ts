import { HttpErrorResponse } from "@angular/common/http";
import {
  HttpClientTestingModule,
  HttpTestingController,
} from "@angular/common/http/testing";
import { TestBed } from "@angular/core/testing";
import { Course } from "../model/course";
import { COURSES, findLessonsForCourse } from "./../../../../server/db-data";
import { CoursesService } from "./courses.service";

describe("CoursesService", () => {
  let coursesService: CoursesService;
  let httpTestingController: HttpTestingController;
  let defaultCourseId: number = 12;

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

  it("should find a course by id", () => {
    coursesService.findCourseById(defaultCourseId).subscribe((course) => {
      expect(course).toBeTruthy();
      expect(course.id).toBe(defaultCourseId);
    });

    const req = httpTestingController.expectOne(
      `/api/courses/${defaultCourseId}`
    );

    expect(req.request.method).toEqual("GET");

    req.flush(COURSES[defaultCourseId]);
  });

  it("should save the course data", () => {
    const testingData: Partial<Course> = { titles: { description: "Testing" } };

    coursesService
      .saveCourse(defaultCourseId, testingData)
      .subscribe((course) => {
        expect(course.id).toBe(defaultCourseId);
      });

    const req = httpTestingController.expectOne(
      `/api/courses/${defaultCourseId}`
    );

    expect(req.request.method).toEqual("PUT");
    expect(req.request.body.titles.description).toEqual(
      testingData.titles.description
    );

    req.flush({ ...COURSES[defaultCourseId], ...testingData });
  });

  it("should give an error if save course fails", () => {
    const testingData = { titles: { description: "Testing" } };

    coursesService.saveCourse(defaultCourseId, testingData).subscribe(
      () => fail("the fail course operation should have failed"),
      (error: HttpErrorResponse) => {
        expect(error.status).toBe(500);
      }
    );

    const req = httpTestingController.expectOne(
      `/api/courses/${defaultCourseId}`
    );
    expect(req.request.method).toEqual("PUT");

    req.flush("save course failed", {
      status: 500,
      statusText: "Internal Server Error",
    });
  });

  it("should find a list of lessons", () => {
    coursesService.findLessons(defaultCourseId).subscribe((lessons) => {
      expect(lessons).toBeTruthy();
      expect(lessons.length).toBe(3);
    });

    const req = httpTestingController.expectOne(
      (req) => req.url === `/api/lessons`
    );

    expect(req.request.method).toEqual("GET");
    expect(req.request.params.get("courseId")).toEqual(`${defaultCourseId}`);
    expect(req.request.params.get("filter")).toEqual("");
    expect(req.request.params.get("sortOrder")).toEqual("asc");
    expect(req.request.params.get("pageNumber")).toEqual("0");
    expect(req.request.params.get("pageSize")).toEqual("3");

    req.flush({ payload: findLessonsForCourse(defaultCourseId).slice(0, 3) });
  });

  afterEach(() => {
    httpTestingController.verify();
  });
});
