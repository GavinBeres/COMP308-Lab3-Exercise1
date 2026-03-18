const CommunityPost = require("../models/CommunityPost");
const HelpRequest = require("../models/HelpRequest");

const resolvers = {
  Query: {
    posts: async () => {
      return await CommunityPost.find().sort({ createdAt: -1 });
    },
    helpRequests: async () => {
      return await HelpRequest.find().sort({ createdAt: -1 });
    },
  },

  Mutation: {
    createPost: async (_, { author, title, content, category, aiSummary }) => {
      return await CommunityPost.create({
        author,
        title,
        content,
        category,
        aiSummary: aiSummary || "",
      });
    },

    createHelpRequest: async (_, { author, description, location }) => {
      return await HelpRequest.create({
        author,
        description,
        location: location || "",
      });
    },

    resolveHelpRequest: async (_, { id }) => {
      return await HelpRequest.findByIdAndUpdate(
        id,
        { isResolved: true },
        { new: true }
      );
    },

    volunteerForHelpRequest: async (_, { id, volunteerName }) => {
      const request = await HelpRequest.findById(id);

      if (!request) {
        throw new Error("Help request not found");
      }

      if (!request.volunteers.includes(volunteerName)) {
        request.volunteers.push(volunteerName);
      }

      await request.save();
      return request;
    },
  },
};

module.exports = resolvers;