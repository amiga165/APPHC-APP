
import React, { Component, useRef, useState } from 'react';
import { StyleSheet } from 'react-native';

import {

  ViroScene,
  ViroButton,
  ViroImage,
  ViroNode,
  ViroAnimations,
  Viro360Video,
  ViroSpinner
}
  from '@viro-community/react-viro';
import { videos, buttonSize } from './constants';
const Viro360Theatre = (props) => {
  const { handle360, handle2d , index=0 } = props;

  const [state, setState] = useState({
    videoControlsAnimation: "fadeIn",
    videoPaused: false,
    loopVideo: true,
    videoIndex: index,
    runAnimation: false,
    isBuffering:false
  })
  const VIDEO_REF = useRef("videoref");
  const _onVideoTapped = () => {
    var videoControlsAnimationState = state.videoControlsAnimation;
    if (videoControlsAnimationState == "fadeIn") {
      videoControlsAnimationState = "fadeOut";
    } else {
      videoControlsAnimationState = "fadeIn";
    }

    setState({
      videoControlsAnimation: videoControlsAnimationState,
      runAnimation: true,
    });
  }
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
          source={require("./res/icon_2D.png")}
          hoverSource={require("./res/icon_2D_hover.png")}
          clickSource={require("./res/icon_2D_hover.png")}
          onClick={_launchTheatreScene} />

        <ViroButton
          position={[0.3, -0.4, -2]}
          scale={[1, 1, 1]}
          width={0.5}
          height={0.5}
          source={require("./res/icon_360_hover.png")}
          hoverSource={require("./res/icon_360_hover.png")}
          clickSource={require("./res/icon_360_hover.png")} />

      </ViroNode>
    );
  }
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
          transformBehaviors={["billboard"]}
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
          transformBehaviors={["billboard"]}
          onClick={_togglePauseVideo} />
      );
    }
  }
  const _launchTheatreScene = () => {
    handle2d(state.videoIndex)
    // props.sceneNavigator.jump("ViroTheatre", { scene: ViroTheatre });
  }
  const _togglePauseVideo = () => {
    setState({
      videoPaused: !state.videoPaused,
    })
  }
  const _playPreviousVideo = () => {
    var currentVideo = state.videoIndex;
    if (currentVideo - 1 > -1) {
      setState({
        videoIndex: (currentVideo - 1),
        videoPaused: false
      });
    }
  }
  const _playNextVideo = () => {
    var currentVideo = state.videoIndex;
    if (currentVideo + 1 < videos.length) {
      setState({
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
    <ViroScene onClick={_onVideoTapped} reticleEnabled={state.videoControlsAnimation == "fadeIn"}
      onPlatformUpdate={(e) => console.log(e)}>
      <Viro360Video ref={VIDEO_REF} source={videos[state.videoIndex]} volume={1.0}
        loop={state.loopVideo} paused={state.videoPaused}
        onBufferStart={() => handleBuffer(true)}
          onBufferEnd={() => handleBuffer(false)} />
   {state.isBuffering &&
          <ViroSpinner
            type='light'
            position={[0, 0, -2]}
          />
        }
      {_renderVideoControl()}

    </ViroScene>
  );

}
export default Viro360Theatre;
ViroAnimations.registerAnimations({
  fadeOut: { properties: { opacity: 0.0 }, duration: 500 },
  fadeIn: { properties: { opacity: 1.0 }, duration: 500 },
});




