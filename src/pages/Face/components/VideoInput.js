import React, { useEffect, useRef, useState } from 'react';
import Webcam from 'react-webcam';
import { loadModels, getFullFaceDescription } from '../api/face';

const useInterval = (callback, delay) => {
  const savedCallback = useRef()

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    function tick() {
      savedCallback.current();
    }
    if (delay !== null) {
      const id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
    return undefined;
  }, [delay]);
};

const VideoInput = () => {
  const webcam = useRef();
  const [smile, setSmile] = useState(false);
  const [openMouth, setOpenMouth] = useState(false);
  const [detections, setDetections] = useState([]);

  useEffect(() => {
    (async () => {
      await loadModels();
    })();
  }, []);

  const WIDTH = 420;
  const HEIGHT = 420;
  const inputSize = 160;

  const capture = async () => {
    if (webcam.current) {

      const fullDesc = await getFullFaceDescription(webcam.current.getScreenshot(), inputSize);
      if (fullDesc?.length) {
        const s = fullDesc.map((fd) => parseFloat(fd?.expressions?.happy)) > 0.9;
        const o = fullDesc.map((fd) => parseFloat(fd?.expressions?.surprised)) > 0.9;
        setDetections(() => fullDesc.map((fd) => fd?.detection));
        if (openMouth) {
          setSmile((v) => v || s);
        }
        setOpenMouth((v) => v || o);
      } else {
        setDetections(() => []);
      }
    }
  };

  const videoConstraints = {
    width: WIDTH,
    height: HEIGHT,
    facingMode: 'user',
  };

  const hint = () => {
    if (detections?.length) {
      if (!openMouth) {
        return '请张嘴 ..';
      }
      if (!smile) {
        return '请微笑';
      }
      if (smile && openMouth) {
        return '通过!';
      }
      return '';
    }
    return '请稍等 ...';
  };

  useInterval(() => capture(), 100);

  return (
    <div
      className="Camera"
      style={{
        display: 'flex',
        flexDirection: 'column',
        flexWrap: 'wrap',
        alignItems: 'center',
      }}
    >
      <div style={{ width: WIDTH, paddingTop: '50px' }}>
        <Webcam
          audio={false}
          width={WIDTH}
          height={HEIGHT}
          ref={webcam}
          screenshotFormat="image/jpeg"
          videoConstraints={videoConstraints}
          style={{ borderRadius: '50%' }}
        />

        <div
          style={{
            border: 'solid',
            borderColor: 'green',
            height: 2,
            width: 2,
            transform: `translate(${WIDTH - 14}px,-${WIDTH - 10}px)`,
            display: `${detections?.length ? 'block' : 'none'}`,
          }}
        />
      </div>
      <div>
        {/* {smile && <p>happy</p>}
        {openMouth && <p>open</p>} */}
        <p>{hint()}</p>
        <img id="static_img" src="" alt="" style={{ display: 'none' }} />
      </div>
    </div>
  );
};

export default VideoInput;
