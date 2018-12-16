package ca.six.simpleaudio

import android.content.Intent
import android.os.Bundle
import android.support.v7.app.AppCompatActivity

class EntryActivity: AppCompatActivity(){
  override fun onCreate(savedInstanceState: Bundle?) {
    super.onCreate(savedInstanceState)
    startActivity(Intent(this, PlayerActivity::class.java))
    this.finish()
  }
}