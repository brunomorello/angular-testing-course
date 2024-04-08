import {ComponentFixture, TestBed, waitForAsync,} from '@angular/core/testing';
import {CoursesCardListComponent} from './courses-card-list.component';
import {CoursesModule} from '../courses.module';
import {COURSES} from '../../../../server/db-data';
import {DebugElement} from '@angular/core';
import {By} from '@angular/platform-browser';
import {sortCoursesBySeqNo} from '../home/sort-course-by-seq';
import {Course} from '../model/course';
import {setupCourses} from '../common/setup-test-data';

describe('CoursesCardListComponent', () => {

  let component: CoursesCardListComponent,
      fixture: ComponentFixture<CoursesCardListComponent>,
      elementDebug: DebugElement;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [CoursesModule]
    }).compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(CoursesCardListComponent);
        component = fixture.componentInstance;
        elementDebug = fixture.debugElement;
      });
  }));


  it("should create the component", () => {

    expect(component).toBeTruthy();

  });


  it("should display the course list", () => {

    component.courses = setupCourses();
    fixture.detectChanges();

    const cards = elementDebug.queryAll(By.css(".course-card"));

    expect(cards).toBeTruthy("Could not find the courses");
    expect(cards.length).toBe(12, "Unexpected number of cards");

  });


  it("should display the first course", () => {

      component.courses = setupCourses();
      fixture.detectChanges();

      const course = component.courses[0];

      const card = elementDebug.query(By.css(".course-card:first-child"));
      const title = card.query(By.css(".mat-mdc-card-title"));
      const cardImage = card.query(By.css("img"));

      // mat-tab-label => mdc-tab

      // mat-tab-body-active  => mat-mdc-tab-body-active
  
      // mat-card-title  => mat-mdc-card-title

      expect(card).toBeTruthy("Could not find the card");
      expect(title).toBeTruthy("Could not find card title");
      expect(cardImage).toBeTruthy("Could not find course image");

      expect(title.nativeElement.textContent).toBe(course.titles.description, "Course Title description must match");
      expect(cardImage.nativeElement.src).toBe(course.iconUrl, "Course URL must match");

  });


});


