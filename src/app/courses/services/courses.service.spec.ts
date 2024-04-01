import { TestBed } from "@angular/core/testing";
import { CoursesService } from "./courses.service";
import { HttpClientTestingModule, HttpTestingController, TestRequest } from "@angular/common/http/testing";
import { Course } from "../model/course";
import { COURSES, findLessonsForCourse } from "../../../../server/db-data";
import { HttpErrorResponse } from "@angular/common/http";
import { Lesson } from "../model/lesson";

describe('CoursesService', () => {

    let coursesService: CoursesService,
        httpTestingController: HttpTestingController;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                HttpClientTestingModule
            ],
            providers: [
                CoursesService
            ]
        });
        
        coursesService = TestBed.inject(CoursesService);
        httpTestingController = TestBed.inject(HttpTestingController);
    });

    afterEach(() => httpTestingController.verify());

    it('should retrieve all courses', () => {
        coursesService.findAllCourses()
            .subscribe((courses: Course[]) => {
                expect(courses).toBeTruthy('No courses returned');
                expect(courses.length).toBe(12, 'Incorrect number of courses');

                const course: Course = courses.find(c => c?.id === 12);

                expect(course.titles.description).toBe('Angular Testing Course');
            })

        const req: TestRequest = httpTestingController.expectOne('/api/courses');

        expect(req.request.method).toEqual('GET');

        req.flush({ payload: Object.values(COURSES) });
    });

    it('should find a course by id', () => {
        coursesService.findCourseById(12)
            .subscribe((course: Course) => {
                expect(course).toBeTruthy('No courses returned');
                expect(course.id).toBe(12);
                expect(course.titles.description).toBe('Angular Testing Course');
            })

        const req: TestRequest = httpTestingController.expectOne('/api/courses/12');

        expect(req.request.method).toEqual('GET');

        req.flush(COURSES[12]);
    });

    it('should save a course', () => {
        const newDescription: string = 'Testing Save Course';
        const propertiesChanged: Partial<Course> = {
            titles: {
                description: newDescription
            }
        };

        coursesService.saveCourse(12, propertiesChanged)
            .subscribe((course: Course) => {
                expect(course).toBeTruthy('Course not saved');
                expect(course.id).toBe(12);
                expect(course.titles.description).toBe(newDescription)
            });

        const req: TestRequest = httpTestingController.expectOne('/api/courses/12');
        
        expect(req.request.method).toEqual('PUT');
        expect(req.request.body.titles.description).toEqual(newDescription);

        req.flush({
            ...COURSES[12],
            ...propertiesChanged
        });
    });

    it('should give an error if save course fails', () => {
        const newDescription: string = 'Testing Save Course';
        const changes: Partial<Course> = {
            titles: {
                description: newDescription
            }
        };

        coursesService.saveCourse(12, changes)
            .subscribe(
                () => fail('Save should fail!!!'),
                (error: HttpErrorResponse) => {
                    expect(error.status).toBe(500)
                }
            );

        const req: TestRequest = httpTestingController.expectOne('/api/courses/12');

        expect(req.request.method).toEqual('PUT');
        
        req.flush('Save course failed', {
            status: 500,
            statusText: 'Internal Server Error'
        });
    });

    it('should find lessons by query params', () => {
        coursesService.findLessons(12)
            .subscribe((lessons: Lesson[]) => {
                expect(lessons).toBeTruthy('No Lessons returned');
                expect(lessons.length).toBe(3);
            });

        const req: TestRequest = httpTestingController.expectOne(req => req.url == '/api/lessons');

        expect(req.request.method).toEqual('GET');
        expect(req.request.params.get('courseId')).toEqual('12');
        expect(req.request.params.get('filter')).toEqual('');
        expect(req.request.params.get('sortOrder')).toEqual('asc');
        expect(req.request.params.get('pageNumber')).toEqual('0');
        expect(req.request.params.get('pageSize')).toEqual('3');

        req.flush({
            payload: findLessonsForCourse(12).slice(0, 3)
        })
    });
});