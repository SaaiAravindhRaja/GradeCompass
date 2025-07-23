import React from 'react';
import { useCourses } from '../contexts/CourseContext';
import CourseManager from './CourseManager';
import GradeForm from './GradeForm';
import GradeSummary from './GradeSummary';

const CourseView: React.FC = () => {
  const {
    courses,
    activeCourseId,
    activeCourse,
    addCourse,
    deleteCourse,
    setActiveCourseId,
    updateCourse,
  } = useCourses();

  // Handle course selection
  const handleCourseSelect = (courseId: string) => {
    setActiveCourseId(courseId);
  };

  // Handle course creation
  const handleCourseCreate = (name: string) => {
    addCourse(name);
  };

  // Handle course deletion
  const handleCourseDelete = (courseId: string) => {
    deleteCourse(courseId);
  };

  // Handle components change
  const handleComponentsChange = (components: any[]) => {
    if (activeCourse) {
      updateCourse({
        ...activeCourse,
        components,
      });
    }
  };

  // Handle target grade change
  const handleTargetGradeChange = (targetGrade: number) => {
    if (activeCourse) {
      updateCourse({
        ...activeCourse,
        targetGrade,
      });
    }
  };

  return (
    <div className="space-y-8">
      {/* Course management */}
      <CourseManager
        courses={courses}
        activeCourseId={activeCourseId}
        onCourseSelect={handleCourseSelect}
        onCourseCreate={handleCourseCreate}
        onCourseDelete={handleCourseDelete}
      />

      {/* Active course content */}
      {activeCourse ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <GradeForm
              components={activeCourse.components}
              onComponentsChange={handleComponentsChange}
            />
          </div>
          <div>
            <GradeSummary
              components={activeCourse.components}
              targetGrade={activeCourse.targetGrade}
              onTargetGradeChange={handleTargetGradeChange}
            />
          </div>
        </div>
      ) : (
        <div className="text-center py-12 text-gray-500 dark:text-gray-400">
          {courses.length > 0 ? (
            <p>Select a course to get started</p>
          ) : (
            <p>Create your first course to get started</p>
          )}
        </div>
      )}
    </div>
  );
};

export default CourseView;