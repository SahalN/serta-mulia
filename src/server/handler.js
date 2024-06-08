/** @format */

// /** @format */

// const predictClassification = require("../services/inferenceService");
// const crypto = require("crypto");

// async function postPredictHandler(request, h) {
//   const { image } = request.payload;
//   const { model } = request.server.app;

//   const { confidenceScore, label, explanation, suggestion } =
//     await predictClassification(model, image);
//   const id = crypto.randomUUID();
//   const createdAt = new Date().toISOString();

//   const data = {
//     id: id,
//     result: label,
//     explanation: explanation,
//     suggestion: suggestion,
//     confidenceScore: confidenceScore,
//     createdAt: createdAt,
//   };

//   const response = h.response({
//     status: "success",
//     message:
//       confidenceScore > 99
//         ? "Model is predicted successfully."
//         : "Model is predicted successfully but under threshold. Please use the correct picture",
//     data,
//   });
//   response.code(201);
//   return response;
// }

// module.exports = postPredictHandler;
const predictClassification = require("../services/inferenceService");
const crypto = require("crypto");
const generateContentWithLabel = require("../services/geminiResponse");

async function postPredictHandler(request, h) {
  const { image } = request.payload;
  const { model } = request.server.app;

  const { confidenceScore, label } = await predictClassification(model, image); // hanya label dan confidenceScore yang diambil dari inferenceService
  const { explanation, suggestion } = await generateContentWithLabel(label); // tambahkan ini
  const id = crypto.randomUUID();
  const createdAt = new Date().toISOString();

  const data = {
    id: id,
    result: label,
    explanation: explanation,
    suggestion: suggestion,
    confidenceScore: confidenceScore,
    createdAt: createdAt,
  };

  const response = h.response({
    status: "success",
    message:
      confidenceScore > 99
        ? "Model is predicted successfully."
        : "Model is predicted successfully but under threshold. Please use the correct picture",
    data,
  });
  response.code(201);
  return response;
}

module.exports = postPredictHandler;
