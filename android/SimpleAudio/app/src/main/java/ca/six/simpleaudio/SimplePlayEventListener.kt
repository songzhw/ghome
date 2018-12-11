package ca.six.simpleaudio

import com.google.android.exoplayer2.ExoPlaybackException
import com.google.android.exoplayer2.PlaybackParameters
import com.google.android.exoplayer2.Player
import com.google.android.exoplayer2.Timeline
import com.google.android.exoplayer2.source.TrackGroupArray
import com.google.android.exoplayer2.trackselection.TrackSelectionArray

class SimplePlayEventListener : Player.EventListener {
    override fun onPlayerStateChanged(playWhenReady: Boolean, playbackState: Int) {
        println("szw PlayEventListenr onPlayerStateChanged()")
        println()
    }

    override fun onPlaybackParametersChanged(playbackParameters: PlaybackParameters?) {
        println("szw PlayEventListenr onPlaybackParametersChanged()")
    }

    override fun onPlayerError(error: ExoPlaybackException?) {
        println("szw PlayEventListenr onPlayerError()")
    }

    override fun onSeekProcessed() {
        println("szw PlayEventListenr onSeekProcessed()")
    }

    override fun onTracksChanged(trackGroups: TrackGroupArray?, trackSelections: TrackSelectionArray?) {
        println("szw PlayEventListenr onTracksChanged()")
    }

    override fun onLoadingChanged(isLoading: Boolean) {
        println("szw PlayEventListenr onLoadingChanged()")
    }

    override fun onPositionDiscontinuity(reason: Int) {
        println("szw PlayEventListenr onPositionDiscontinuity()")
    }

    override fun onRepeatModeChanged(repeatMode: Int) {
        println("szw PlayEventListenr onRepeatModeChanged()")
    }

    override fun onShuffleModeEnabledChanged(shuffleModeEnabled: Boolean) {
        println("szw PlayEventListenr onShuffleModeEnabledChanged()")
    }

    override fun onTimelineChanged(timeline: Timeline?, manifest: Any?) {
        println("szw PlayEventListenr onTimelineChanged()")
    }
}