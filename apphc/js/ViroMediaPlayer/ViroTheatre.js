
import React, { useState, useRef } from 'react';
import { StyleSheet, Alert } from 'react-native';
import {
  ViroScene,
  ViroVideo,
  ViroMaterials,
  ViroButton,
  ViroImage,
  ViroNode,
  ViroAnimations,
  ViroSpinner,
}
  from '@viro-community/react-viro';
import { videos, buttonSize } from './constants';
const ViroTheatre = (props) => {
  const { index=0, navigation ,handle360 } = props;
  const VIDEO_REF = useRef("videoref");
  const [state, setState] = useState({
    videoControlsAnimation: "fadeIn",
    videoPaused: false,
    loopVideo: true,
    videoIndex: index,
    runAnimation: false,
    isBuffering: false
  })
  const _onVideoTapped = () => {
    var videoControlsAnimationState = state.videoControlsAnimation;
    if (videoControlsAnimationState == "fadeIn") {
      videoControlsAnimationState = "fadeOut";
    } else {
      videoControlsAnimationState = "fadeIn";
    }

    setState({
      ...state,
      videoControlsAnimation: videoControlsAnimationState,
      runAnimation: true,
    });
  }
  /**
   * Render a set of Video UI Controls. This includes (in the order displayed from left to right):
   * Restart, Previous Video, Play/Pause, Next Video, Volume.
   */
  const _renderVideoControl = () => {
    return (
      <ViroNode position={[0, -0.8, 0]} opacity={1.0}
        animation={{ name: state.videoControlsAnimation, run: state.runAnimation, loop: false }} >
        <ViroImage
          scale={[1.4, 1.2, 1]}
          position={[0, -0.27, -2.1]}
          source={require("./res/player_controls_container.png")} />

        <ViroButton
          position={[-buttonSize - 0.1, 0, -2]}
          scale={[1, 1, 1]}
          width={buttonSize}
          height={buttonSize}
          source={require("./res/previous.png")}
          hoverSource={require("./res/previous_hover.png")}
          clickSource={require("./res/previous_hover.png")}
          onClick={_playPreviousVideo} />

        {_renderPlayControl()}

        <ViroButton
          position={[buttonSize + 0.1, 0, -2]}
          scale={[1, 1, 1]}
          width={buttonSize}
          height={buttonSize}
          source={require("./res/skip.png")}
          hoverSource={require("./res/skip_hover.png")}
          clickSource={require("./res/skip_hover.png")}
          onClick={_playNextVideo} />

        <ViroButton
          position={[-0.3, -0.4, -2]}
          scale={[1, 1, 1]}
          width={0.5}
          height={0.5}
          source={require("./res/icon_2D_hover.png")}
          hoverSource={require("./res/icon_2D_hover.png")}
          clickSource={require("./res/icon_2D_hover.png")} />
        
        <ViroButton
          position={[0.3, -0.4, -2]}
          scale={[1, 1, 1]}
          width={0.5}
          height={0.5}
          source={require("./res/icon_360.png")}
          hoverSource={require("./res/icon_360_hover.png")}
          clickSource={require("./res/icon_360_hover.png")}
          onClick={_launchTheatreScene} />

      </ViroNode>
    );
  }

  /**
   * Renders either the play or pause icon depending on video state.
   */
  const _renderPlayControl = () => {
    if (state.videoPaused) {
      return (
        <ViroButton
          position={[0, 0, -2]}
          scale={[1, 1, 1]}
          width={buttonSize}
          height={buttonSize}
          source={require("./res/play.png")}
          hoverSource={require("./res/play_hover.png")}
          clickSource={require("./res/play_hover.png")}
          onClick={_togglePauseVideo} />
      );
    } else {
      return (
        <ViroButton
          position={[0, 0, -2]}
          scale={[1, 1, 1]}
          width={buttonSize}
          height={buttonSize}
          source={require("./res/pause.png")}
          hoverSource={require("./res/pause_hover.png")}
          clickSource={require("./res/pause_hover.png")}
          onClick={_togglePauseVideo} />
      );
    }
  }

  const _launchTheatreScene = () => {
    handle360(state.videoIndex);
    // props.sceneNavigator.jump("Viro360Theatre", { scene: Viro360Theatre });
  }
  const _togglePauseVideo = () => {
    setState({
      ...state,
      videoPaused: !state.videoPaused,
    })
  }

  /**
   * Play the previous video by setting the videoIndex.
   */
  const _playPreviousVideo = () => {
    var currentVideo = state.videoIndex;
    if (currentVideo - 1 > -1) {
      setState({
        ...state,
        videoIndex: (currentVideo - 1),
        videoPaused: false
      });
    }
  }

  /**
   * Play the next video by setting the videoIndex.
   */
  const _playNextVideo = () => {
    var currentVideo = state.videoIndex;
    if (currentVideo + 1 < videos.length) {
      setState({
        ...state,
        videoIndex: (currentVideo + 1),
        videoPaused: false
      });
    }
  }
  const handleBuffer = (isBuffering) => {
    setState({
      ...state,
      isBuffering: isBuffering
    });
  }
  return (
    <>
      <ViroScene onClick={_onVideoTapped} reticleEnabled={state.videoControlsAnimation == "fadeIn"} onPlatformUpdate={(e) => console.log(e)}>
        {/* <Viro360Image source={require('./res/dark_theatre.jpg')} /> */}
        <ViroVideo ref={VIDEO_REF} source={videos[state.videoIndex]} volume={1.0}
          position={[0, 3.9, -45]} scale={[44, 22, 1]} loop={state.loopVideo}
          paused={state.videoPaused}
          onBufferStart={() => handleBuffer(true)}
          onBufferEnd={() => handleBuffer(false)} />

        {_renderVideoControl()}
        {state.isBuffering &&
          <ViroSpinner
            type='light'
            position={[0, 0, -2]}
          />
        }
      </ViroScene>
    </>
  )
}
export default ViroTheatre;
ViroAnimations.registerAnimations({
  fadeOut: { properties: { opacity: 0.0 }, duration: 500 },
  fadeIn: { properties: { opacity: 1.0 }, duration: 500 },
});

ViroMaterials.createMaterials({
  opaqueWhite: {
    shininess: 2.0,
    lightingModel: "Lambert",
    diffuseColor: "#FFFFFF"
  },
});

