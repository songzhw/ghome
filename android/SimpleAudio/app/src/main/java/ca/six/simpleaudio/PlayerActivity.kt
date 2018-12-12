package ca.six.simpleaudio

import android.content.ComponentName
import android.os.Bundle
import android.support.v4.media.MediaBrowserCompat
import android.support.v4.media.session.MediaControllerCompat
import android.support.v7.app.AppCompatActivity
import android.view.View
import kotlinx.android.synthetic.main.activity_player.*

class PlayerActivity : AppCompatActivity(), View.OnClickListener {
    private lateinit var mediaBrowser: MediaBrowserCompat
    private lateinit var mediaController: MediaControllerCompat

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_player)

        val componentName = ComponentName(this, PlayerService::class.java)
        mediaBrowser = MediaBrowserCompat(this, componentName,  connectionCallbacks, null)
        ibPause.setOnClickListener(this)
        ibPlay.setOnClickListener(this)
    }

    private val connectionCallbacks = object : MediaBrowserCompat.ConnectionCallback() {
        override fun onConnected() {
            val context = this@PlayerActivity
            mediaBrowser.sessionToken.also { token ->
                mediaController = MediaControllerCompat(context, token)
                MediaControllerCompat.setMediaController(context, mediaController)
            }
        }

        override fun onConnectionSuspended() {
            println("szw PlayerActivity connectCallback : onConnectionSuspended()")
        }

        override fun onConnectionFailed() {
            println("szw PlayerActivity connectCallback : onConnectionFailed()")
        }
    }

    override fun onStart() {
        super.onStart()
        mediaBrowser.connect()
    }

    override fun onStop() {
        super.onStop()
        mediaBrowser.disconnect()
    }

    override fun onClick(v: View) {
        if(v == ibPlay){
            mediaController.transportControls.play()
        } else if (v == ibPause){
            mediaController.transportControls.pause()
        }
    }

}

// ref: https://cdn-images-1.medium.com/max/2000/1*iu1emZtq5AorvsfYNzoF6A.png
