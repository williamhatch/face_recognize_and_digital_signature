import * as faceapi from 'face-api.js';

export const loadModels = async () => {
  const MODEL_URL = `${window.location.origin}/models`;

  await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
  await faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL);
};

export const getFullFaceDescription = async (blob: any, inputSize: any) => {
  if (!blob) {
    return null;
  }
  const OPTION = new faceapi.TinyFaceDetectorOptions({ inputSize, scoreThreshold: 0.5 });

  const img = document.querySelector('#static_img');
  if (!img) {
    throw new Error('need have a tag for img to load img preview!');
  }
  img!.src = blob;

  const result = await faceapi.detectAllFaces(img!, OPTION).withFaceExpressions();
  return result;
};

const maxDescriptorDistance = 0.5;

export async function createMatcher(faceProfile: any) {
  const members = Object.keys(faceProfile);
  const labeledDescriptors = members.map(
    (member) =>
      new faceapi.LabeledFaceDescriptors(
        faceProfile[member].name,
        faceProfile[member].descriptors.map((descriptor: any) => new Float32Array(descriptor)),
      ),
  );

  const faceMatcher = new faceapi.FaceMatcher(labeledDescriptors, maxDescriptorDistance);
  return faceMatcher;
}
