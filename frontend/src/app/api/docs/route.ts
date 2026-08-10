import { NextResponse } from 'next/server';

export async function GET() {
  const swaggerHtml = `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <title>Schollege MS - API Documentation</title>
    <link rel="stylesheet" type="text/css" href="https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.18.3/swagger-ui.css" />
    <style>
      html { box-sizing: border-box; overflow: -moz-scrollbars-vertical; overflow-y: scroll; }
      *, *:before, *:after { box-sizing: inherit; }
      body { margin:0; background: #fafafa; }
    </style>
  </head>
  <body>
    <div id="swagger-ui"></div>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.18.3/swagger-ui-bundle.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.18.3/swagger-ui-standalone-preset.js"></script>
    <script>
      window.onload = function() {
        const spec = {
          "openapi": "3.0.0",
          "info": {
            "title": "Schollege MS API",
            "version": "1.0.0",
            "description": "RESTful API documentation for Schollege MS. Enforces RBAC permissions for Admin, Teacher, and Student roles."
          },
          "paths": {
            "/api/users": {
              "get": { "summary": "List all users (Admin only)", "responses": { "200": { "description": "Array of users" } } }
            },
            "/api/classes": {
              "get": { "summary": "List all classes", "responses": { "200": { "description": "Array of classes" } } },
              "post": { "summary": "Create new class (Admin only)", "responses": { "201": { "description": "Class created" } } }
            },
            "/api/subjects": {
              "get": { "summary": "List all subjects", "responses": { "200": { "description": "Array of subjects" } } },
              "post": { "summary": "Create subject & assign teacher (Admin only)", "responses": { "201": { "description": "Subject created" } } }
            },
            "/api/enrollments": {
              "get": { "summary": "List class enrollments", "responses": { "200": { "description": "Array of enrollments" } } },
              "post": { "summary": "Enroll student in class (Admin only)", "responses": { "201": { "description": "Enrollment created" } } }
            },
            "/api/assignments": {
              "get": { "summary": "List assignments (Role-filtered)", "responses": { "200": { "description": "Array of assignments" } } },
              "post": { "summary": "Create assignment (Teacher only)", "responses": { "201": { "description": "Assignment created" } } }
            },
            "/api/submissions": {
              "get": { "summary": "List submissions (Role-filtered)", "responses": { "200": { "description": "Array of submissions" } } },
              "post": { "summary": "Submit answer (Student only, checks deadline)", "responses": { "201": { "description": "Submission created" } } }
            },
            "/api/submissions/{id}/grade": {
              "post": { "summary": "Grade student submission (Teacher only, validates marks <= maxMarks)", "responses": { "200": { "description": "Submission graded" } } }
            }
          }
        };

        window.ui = SwaggerUIBundle({
          spec: spec,
          dom_id: '#swagger-ui',
          deepLinking: true,
          presets: [
            SwaggerUIBundle.presets.apis,
            SwaggerUIStandalonePreset
          ],
          plugins: [
            SwaggerUIBundle.plugins.DownloadUrl
          ],
          layout: "StandaloneLayout"
        });
      };
    </script>
  </body>
  </html>
  `;

  return new Response(swaggerHtml, {
    headers: { 'Content-Type': 'text/html' },
  });
}
