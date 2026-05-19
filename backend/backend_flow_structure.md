server/
│
├── package.json
├── server.js
├── .env
├── .gitignore
│
├── config/
│ ├── db.js
│ ├── cloudinary.js
│ ├── socket.js
│ └── mailConfig.js
│
├── controllers/
│ │
│ ├── auth.controller.js
│ ├── student.controller.js
│ ├── admin.controller.js
│ ├── recruiter.controller.js
│ ├── company.controller.js
│ ├── drive.controller.js
│ ├── application.controller.js
│ ├── interview.controller.js
│ ├── round.controller.js
│ ├── notification.controller.js
│ ├── resume.controller.js
│ ├── report.controller.js
│ ├── eligibility.controller.js
│ ├── recommendation.controller.js
│ ├── aiResume.controller.js
│ ├── codingTest.controller.js
│ ├── chat.controller.js
│ └── analytics.controller.js
│
├── models/
│ │
│ ├── User.model.js
│ ├── Student.model.js
│ ├── Admin.model.js
│ ├── Recruiter.model.js
│ ├── Company.model.js
│ ├── Drive.model.js
│ ├── Application.model.js
│ ├── Interview.model.js
│ ├── Round.model.js
│ ├── Notification.model.js
│ ├── Resume.model.js
│ ├── Message.model.js
│ ├── Report.model.js
│ ├── Eligibility.model.js
│ ├── CodingTest.model.js
│ ├── Result.model.js
│ └── Analytics.model.js
│
├── routes/
│ │
│ ├── auth.routes.js
│ ├── student.routes.js
│ ├── admin.routes.js
│ ├── recruiter.routes.js
│ ├── company.routes.js
│ ├── drive.routes.js
│ ├── application.routes.js
│ ├── interview.routes.js
│ ├── round.routes.js
│ ├── notification.routes.js
│ ├── resume.routes.js
│ ├── report.routes.js
│ ├── eligibility.routes.js
│ ├── recommendation.routes.js
│ ├── aiResume.routes.js
│ ├── codingTest.routes.js
│ ├── chat.routes.js
│ └── analytics.routes.js
│
├── middleware/
│ │
│ ├── authMiddleware.js
│ ├── roleMiddleware.js
│ ├── uploadMiddleware.js
│ ├── errorMiddleware.js
│ ├── validationMiddleware.js
│ └── eligibilityMiddleware.js
│
├── services/
│ │
│ ├── auth.service.js
│ ├── email.service.js
│ ├── notification.service.js
│ ├── aiResume.service.js
│ ├── eligibility.service.js
│ ├── recommendation.service.js
│ ├── codingTest.service.js
│ ├── analytics.service.js
│ ├── report.service.js
│ └── chat.service.js
│
├── sockets/
│ │
│ ├── chat.socket.js
│ ├── notification.socket.js
│ └── interview.socket.js
│
├── utils/
│ │
│ ├── generateToken.js
│ ├── sendEmail.js
│ ├── calculateATS.js
│ ├── calculateEligibility.js
│ ├── logger.js
│ ├── pdfParser.js
│ ├── responseHandler.js
│ └── asyncHandler.js
│
├── uploads/
│ │
│ ├── resumes/
│ ├── profile-images/
│ └── reports/
│
├── validations/
│ │
│ ├── auth.validation.js
│ ├── student.validation.js
│ ├── company.validation.js
│ ├── drive.validation.js
│ └── application.validation.js
│
├── constants/
│ │
│ ├── roles.js
│ ├── roundTypes.js
│ ├── status.js
│ └── messages.js
│
├── database/
│ │
│ ├── seedAdmin.js
│ ├── seedCompanies.js
│ └── seedStudents.js
│
└── tests/
│
├── auth.test.js
├── student.test.js
├── company.test.js
├── application.test.js
└── drive.test.js
