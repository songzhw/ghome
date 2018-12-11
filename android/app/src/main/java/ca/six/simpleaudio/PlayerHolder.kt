package ca.six.simpleaudio

import android.content.Context
import com.google.android.exoplayer2.ExoPlayer
import com.google.android.exoplayer2.ExoPlayerFactory
import com.google.android.exoplayer2.source.MediaSource
import com.google.android.exoplayer2.trackselection.DefaultTrackSelector

class PlayerHolder(context: Context) {
    private val player: ExoPlayer
    private val playEventListenter = SimplePlayEventListener()

    init {
        val trackSelector = DefaultTrackSelector()
        player = ExoPlayerFactory.newSimpleInstance(context, trackSelector)
    }

    fun initPlayer(mediaSource: MediaSource) {
        player.stop()
        player.seekTo(0L)
        player.addListener(playEventListenter)
        player.prepare(mediaSource)
    }

    fun releasePlayer() {
        player.stop()
        player.release()
    }

    fun stopPlayer() {
        player.stop()
    }

    fun setCanPlayWhenReady(canPlayWhenReady: Boolean) {
        player.playWhenReady = canPlayWhenReady
    }

}