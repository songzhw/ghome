package ca.six.simpleaudio

import android.media.browse.MediaBrowser
import android.media.session.MediaSession
import android.os.Bundle
import android.service.media.MediaBrowserService

class PlayerService : MediaBrowserService() {
    private lateinit var mediaSession: MediaSession
    private lateinit var playerHolder: PlayerHolder

    override fun onCreate() {
        super.onCreate()
    }

    private val mediaSessionCallback = object : MediaSession.Callback() {

    }

    override fun onLoadChildren(parentId: String, result: Result<MutableList<MediaBrowser.MediaItem>>) {
        TODO("not implemented") //To change body of created functions use File | Settings | File Templates.
    }

    override fun onGetRoot(clientPackageName: String, clientUid: Int, rootHints: Bundle?): BrowserRoot? {
        TODO("not implemented") //To change body of created functions use File | Settings | File Templates.
    }
}

// ref: https://cdn-images-1.medium.com/max/2000/1*VtWayH4MGWkH35wo8WO0XQ.png