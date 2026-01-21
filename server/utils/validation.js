const validateCourseData = (courseData, isUpdate = false) => {
  const errors = [];

  if (!isUpdate || courseData.title !== undefined) {
    if (!courseData.title || typeof courseData.title !== 'string') {
      errors.push('Title is required and must be a string');
    } else if (courseData.title.trim().length < 5) {
      errors.push('Title must be at least 5 characters long');
    } else if (courseData.title.trim().length > 200) {
      errors.push('Title must not exceed 200 characters');
    }
  }

  if (!isUpdate || courseData.price !== undefined) {
    if (courseData.price === undefined || courseData.price === null) {
      errors.push('Price is required');
    } else {
      const price = parseFloat(courseData.price);
      if (isNaN(price)) {
        errors.push('Price must be a valid number');
      } else if (price < 0) {
        errors.push('Price cannot be negative');
      } else if (price > 10000) {
        errors.push('Price cannot exceed 10000');
      }
    }
  }

  if (courseData.description !== undefined) {
    if (typeof courseData.description !== 'string') {
      errors.push('Description must be a string');
    } else if (courseData.description.trim().length > 5000) {
      errors.push('Description must not exceed 5000 characters');
    }
  }

  if (courseData.category !== undefined && courseData.category !== null) {
    if (typeof courseData.category !== 'object') {
      errors.push('Category must be an object');
    } else {
      if (courseData.category.name && typeof courseData.category.name !== 'string') {
        errors.push('Category name must be a string');
      }
      if (courseData.category.tags && !Array.isArray(courseData.category.tags)) {
        errors.push('Category tags must be an array');
      }
    }
  }

  if (courseData.syllabus !== undefined) {
    if (!Array.isArray(courseData.syllabus)) {
      errors.push('Syllabus must be an array');
    } else {
      courseData.syllabus.forEach((module, index) => {
        if (!module.title || typeof module.title !== 'string') {
          errors.push(`Syllabus module ${index + 1}: title is required and must be a string`);
        }
        if (module.lessons && !Array.isArray(module.lessons)) {
          errors.push(`Syllabus module ${index + 1}: lessons must be an array`);
        }
      });
    }
  }

  if (courseData.specifications !== undefined) {
    if (typeof courseData.specifications !== 'object' || courseData.specifications === null) {
      errors.push('Specifications must be an object');
    } else {
      const validLevels = ['Beginner', 'Intermediate', 'Advanced', 'All Levels'];
      if (courseData.specifications.level && !validLevels.includes(courseData.specifications.level)) {
        errors.push(`Level must be one of: ${validLevels.join(', ')}`);
      }
      if (courseData.specifications.subtitles && !Array.isArray(courseData.specifications.subtitles)) {
        errors.push('Subtitles must be an array');
      }
      if (courseData.specifications.requirements && !Array.isArray(courseData.specifications.requirements)) {
        errors.push('Requirements must be an array');
      }
    }
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

const sanitizeCourseData = (courseData) => {
  const sanitized = {};

  if (courseData.title) {
    sanitized.title = courseData.title.trim();
  }

  if (courseData.price !== undefined) {
    sanitized.price = parseFloat(courseData.price);
  }

  if (courseData.description) {
    sanitized.description = courseData.description.trim();
  }

  if (courseData.category) {
    sanitized.category = courseData.category;
  }

  if (courseData.instructor) {
    sanitized.instructor = courseData.instructor;
  }

  if (courseData.syllabus) {
    sanitized.syllabus = courseData.syllabus;
  }

  if (courseData.specifications) {
    sanitized.specifications = courseData.specifications;
  }

  if (courseData.metadata) {
    sanitized.metadata = courseData.metadata;
  }

  return sanitized;
};

module.exports = {
  validateCourseData,
  sanitizeCourseData
};
