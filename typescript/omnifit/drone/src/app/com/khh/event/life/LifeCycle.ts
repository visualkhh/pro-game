//https://www.ntu.edu.sg/home/ehchua/programming/android/images/Android_ActivityLifeCycle.png
interface LifeCycle {
  onCreate(data?: any);
  onStart(data?: any);
  onResume(data?: any);
  //activity
  onPause(data?: any);  onRestart(data?: any);
  onStop(data?: any);
  onDestroy(data?: any);
}
