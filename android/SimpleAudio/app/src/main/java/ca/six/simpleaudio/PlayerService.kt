package ca.six.simpleaudio

import android.media.session.MediaSession
import android.net.Uri
import android.os.Bundle
import android.support.v4.media.MediaBrowserCompat
import android.support.v4.media.MediaBrowserServiceCompat
import android.support.v4.media.session.MediaSessionCompat
import android.support.v4.media.session.PlaybackStateCompat


class PlayerService : MediaBrowserServiceCompat() {
    private val MEDIA_SESSION_TAG = "SimpleAudio_MediaSessionTag"

    private lateinit var mediaSession: MediaSessionCompat
    private lateinit var playerHolder: PlayerHolder

    override fun onCreate() {
        super.onCreate()

        playerHolder = PlayerHolder(this)

        val playbackState = PlaybackStateCompat.Builder()
            .setActions(
                PlaybackStateCompat.ACTION_PLAY or
                        PlaybackStateCompat.ACTION_PLAY_PAUSE or
                        PlaybackStateCompat.ACTION_PLAY_FROM_SEARCH or
                        PlaybackStateCompat.ACTION_PLAY_FROM_MEDIA_ID or
                        PlaybackStateCompat.ACTION_SKIP_TO_NEXT or
                        PlaybackStateCompat.ACTION_SKIP_TO_PREVIOUS
            )
            .build()

        mediaSession = MediaSessionCompat(this, MEDIA_SESSION_TAG)
        mediaSession.setFlags(MediaSessionCompat.FLAG_HANDLES_MEDIA_BUTTONS or MediaSessionCompat.FLAG_HANDLES_TRANSPORT_CONTROLS)
        mediaSession.setPlaybackState(playbackState)
        mediaSession.setCallback(MediaSessionCallback())

        this.sessionToken = mediaSession.sessionToken

    }

    override fun onDestroy() {
        super.onDestroy()
        playerHolder.releasePlayer()
        mediaSession.release()
    }

    override fun onLoadChildren(parentId: String, result: Result<MutableList<MediaBrowserCompat.MediaItem>>) {
        TODO("not implemented") //To change body of created functions use File | Settings | File Templates.
    }

    override fun onGetRoot(clientPackageName: String, clientUid: Int, rootHints: Bundle?): BrowserRoot? {
        TODO("not implemented") //To change body of created functions use File | Settings | File Templates.
    }

    inner class MediaSessionCallback : MediaSessionCompat.Callback() {
        override fun onPlay() {
            mediaSession.isActive = true
            playerHolder.setCanPlayWhenReady(true)
        }

        override fun onPause() {
            mediaSession.isActive = false
            playerHolder.setCanPlayWhenReady(false)
        }

        override fun onStop() {
            mediaSession.isActive = false
            playerHolder.stopPlayer()
        }


        override fun onPlayFromSearch(query: String?, extras: Bundle?) {
            println("szw MediaSessionCallback onPlayFromSearch()")
        }

        override fun onPlayFromUri(uri: Uri, extras: Bundle?) {
            println("szw MediaSessionCallback onPlayFromUri($uri) : $extras")
        }
    }

}

// ref: https://cdn-images-1.medium.com/max/2000/1*VtWayH4MGWkH35wo8WO0XQ.png

/*
1. MediaBrowserServiceCompat requires the 'com.android.support:support-media-compat:<version>' package

 */