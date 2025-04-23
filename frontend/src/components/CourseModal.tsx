const handleEnroll = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (user?.role !== 'student') {
      setError('Only students can enroll in courses');
      return;
    }

    try {
      setIsEnrolling(true);
      setError(null);
      
      console.log('Attempting to enroll in course:', course.id);
      
      // Send enrollment request
      const response = await API.post(`/courses/${course.id}/enroll`);
      console.log('Enrollment response:', response.data);

      // Show success message
      toast.success('Successfully enrolled in the course!');
      
      // Close modal and navigate to course
      onClose();
      navigate(`/course/${course.id}`);
    } catch (error: any) {
      console.error('Course enrollment error:', error);
      
      if (error.response?.status === 404) {
        setError('Course not found');
      } else if (error.response?.status === 400) {
        setError(error.response.data?.message || 'Course is full');
      } else if (error.response?.status === 401) {
        setError('Please log in again');
        navigate('/login');
      } else if (error.response?.status === 500) {
        setError('Server error. Please try again later.');
      } else {
        setError(error.response?.data?.message || 'Failed to enroll in the course. Please try again.');
      }
    } finally {
      setIsEnrolling(false);
    }
}; 