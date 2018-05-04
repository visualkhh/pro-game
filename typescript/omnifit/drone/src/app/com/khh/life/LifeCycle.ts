//https://www.ntu.edu.sg/home/ehchua/programming/android/images/Android_ActivityLifeCycle.png
interface LifeCycle {
  onCreate();
  onStart();
  onResume();
  //activity
  onPause();  onRestart();
  onStop();
  onDestroy();
}
