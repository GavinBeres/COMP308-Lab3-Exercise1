const typeDefs = `#graphql
  type CommunityPost {
    id: ID!
    author: String!
    title: String!
    content: String!
    category: String!
    aiSummary: String
    createdAt: String
    updatedAt: String
  }

  type HelpRequest {
    id: ID!
    author: String!
    description: String!
    location: String
    isResolved: Boolean
    volunteers: [String]
    createdAt: String
    updatedAt: String
  }

  type Query {
    posts: [CommunityPost]
    helpRequests: [HelpRequest]
  }

  type Mutation {
    createPost(author: String!, title: String!, content: String!, category: String!, aiSummary: String): CommunityPost
    createHelpRequest(author: String!, description: String!, location: String): HelpRequest
    resolveHelpRequest(id: ID!): HelpRequest
    volunteerForHelpRequest(id: ID!, volunteerName: String!): HelpRequest
    deletePost(id: ID!): CommunityPost
deleteHelpRequest(id: ID!): HelpRequest
  }
`;

module.exports = typeDefs;