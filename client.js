console.clear();

const base = "http://localhost:3000";

const functions = {
  async postCourse() {
    const response = await fetch(base + "/lms/course", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        slug: "javascript-completo",
        title: "JavaScript Completo",
        description: "Curso completo de JavaScript",
        lessons: 80,
        hours: 20,
      }),
    });
    const body = await response.json();
    console.table(body);
  },
  async postLessons(lesson) {
    const response = await fetch(base + "/lms/lesson", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(lesson),
    });
    const body = await response.json();
    console.table(body);
  },
  async getCourses() {
    const response = await fetch(base + "/lms/courses", {
      method: "GET",
    });
    const body = await response.json();
    console.log(body);
  },
  async getCourse() {
    const response = await fetch(base + "/lms/course/javascript-completo", {
      method: "GET",
    });
    const body = await response.json();
    console.log(body);
  },
  async getLesson() {
    const response = await fetch(
      base + "/lms/lesson/javascript-completo/funcoes-basico",
      {
        method: "GET",
      },
    );
    const body = await response.json();
    console.log(body);
  },
};

if (process.argv[2]) {
  functions[process.argv[2]]();
}
