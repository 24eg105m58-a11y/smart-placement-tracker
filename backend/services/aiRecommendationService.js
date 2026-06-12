import { JobPostingModel }
  from "../models/jobPostings-model.js";

export const getRecommendedJobs =
  async ({
    academicDetails,
    resume,
  }) => {

    const jobs =
      await JobPostingModel.find({
        status: "OPEN",
      });

    const branch =
      academicDetails?.branch || "";

    const cgpa =
      academicDetails?.cgpa || 0;

    const atsScore =
      resume?.atsScore || 0;

    const recommendations =
      jobs.map((job) => {

        let score = 0;

        if (
          job.eligibleBranches?.includes(
            branch
          )
        ) {
          score += 50;
        }

        if (
          cgpa >=
          job.minimumCGPA
        ) {
          score += 30;
        }

        if (
          atsScore >= 80
        ) {
          score += 20;
        }
        else if (
          atsScore >= 60
        ) {
          score += 10;
        }

        return {
          ...job.toObject(),
          matchScore: score,
        };
      });

    return recommendations.sort(
      (a, b) =>
        b.matchScore - a.matchScore
    );
  };