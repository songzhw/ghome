package ca.six.simpleaudio

import android.app.PendingIntent
import android.content.Intent
import android.net.Uri
import android.os.Bundle
import android.support.v4.media.MediaBrowserCompat
import android.support.v4.media.MediaBrowserServiceCompat
import android.support.v4.media.session.MediaSessionCompat
import android.support.v4.media.session.PlaybackStateCompat
import com.google.android.exoplayer2.extractor.DefaultExtractorsFactory
import com.google.android.exoplayer2.source.ExtractorMediaSource
import com.google.android.exoplayer2.upstream.DefaultDataSourceFactory
import com.google.android.exoplayer2.util.Util


class PlayerService : MediaBrowserServiceCompat() {
  private val TAG_FOR_DEBUG = "Service_Tag"
  private val SIMPLE_AUDIO_EMPTY_PARENT_ID = "ca.six.SIMPLE_AUDIO_EMPTY_PARENT_ID"
  private val MEDIA_ID_ROOT = "MEDIA_ID_ROOT"
  private val EMPTY_MEDIA_ID_ROOT = "EMPTY_MEDIA_ID_ROOT"

  private lateinit var mediaSession: MediaSessionCompat
  private lateinit var playerHolder: PlayerHolder
  private lateinit var packageValidator : PackageValidator

  override fun onCreate() {
    super.onCreate()

    // TODO remove it to outside
    val userAgent = Util.getUserAgent(this, "SimpleAudio") // Util from Exo
    val mediaUri = Uri.parse("asset:///jazz_in_paris.mp3")
    val dataSrcFactory = DefaultDataSourceFactory(this, userAgent)
    val mediaSource = ExtractorMediaSource(mediaUri, dataSrcFactory, DefaultExtractorsFactory(), null, null)

    packageValidator = PackageValidator(this)
    playerHolder = PlayerHolder(this)
    playerHolder.initPlayer(mediaSource)

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

    mediaSession = MediaSessionCompat(this, TAG_FOR_DEBUG)
    this.sessionToken = mediaSession.sessionToken
    mediaSession.setFlags(MediaSessionCompat.FLAG_HANDLES_MEDIA_BUTTONS or MediaSessionCompat.FLAG_HANDLES_TRANSPORT_CONTROLS)
    mediaSession.setPlaybackState(playbackState) //由Builder生成, 主要就是响应哪些action(play, pause, playFromSearch..)
    mediaSession.setCallback(MediaSessionCallback())

    val context = applicationContext
    val intent = Intent(context, EntryActivity::class.java)
    val pi = PendingIntent.getActivity(
      context, 99 /*request code*/,
      intent, PendingIntent.FLAG_UPDATE_CURRENT
    )
    mediaSession.setSessionActivity(pi)

  }

  override fun onDestroy() {
    super.onDestroy()
    playerHolder.releasePlayer()
    mediaSession.release()
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
      println("szw MediaSessionCallback onPlayFromSearch($query) : $extras")
    }

    override fun onPlayFromUri(uri: Uri, extras: Bundle?) {
      println("szw MediaSessionCallback onPlayFromUri($uri) : $extras")
    }
  }

  // = = = = = = = = = = = = = = = = = = = = = = = =

  // clientPkgName: ca.six.simpleaudio, clientUid=10402, rootHints: [{}]
  override fun onGetRoot(clientPackageName: String, clientUid: Int, rootHints: Bundle?): BrowserRoot? {
    println("szw service.onGetRoot($clientPackageName)")
    if (!packageValidator.isCallerAllowed(this, clientPackageName, clientUid)) {
      return MediaBrowserServiceCompat.BrowserRoot(EMPTY_MEDIA_ID_ROOT, null)
    }

    return MediaBrowserServiceCompat.BrowserRoot(MEDIA_ID_ROOT, null)
  }

  override fun onLoadChildren(parentId: String, result: Result<List<MediaBrowserCompat.MediaItem>>) {
    println("szw service.onLoadChildren($parentId)")
    // forbid the browsing from outside
    if (SIMPLE_AUDIO_EMPTY_PARENT_ID == parentId) { //kotlin中string的比较可以用==, 而不是一定要用equals()
      result.sendResult(null)
      return
    }

    result.sendResult(emptyList())
  }




}

// ref: https://cdn-images-1.medium.com/max/2000/1*VtWayH4MGWkH35wo8WO0XQ.png

/*
1. MediaBrowserServiceCompat requires the 'com.android.support:support-media-compat:<version>' dependency

2.

 */