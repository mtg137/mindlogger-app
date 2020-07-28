/** Class implementing a generic timer */
class Timer {
  /**
   * Number of seconds for the countdown.
   *
   * @private
   * @type {number}
   */
  _countdownTime = 0;

  /**
   * Absolute time when the countdown will reach zero.
   *
   * @private
   * @type {number}
   */
  _cbTriggerTime = Date.now();

  /**
   * Property that stores the setInterval() instance.
   *
   * @private
   * @type {number}
   */
  _subscription = 0;

  /**
   * Function to be called when the countdown reaches zero.
   *
   * @private
   * @type {function}
   */
  _callback = null;


  /**
   * Binds the public functions.
   * @constructor
   */
  constructor() {
    this.startCountdown = this.startCountdown.bind(this);
    this.resetCountdown = this.resetCountdown.bind(this);
    this.clear = this.clear.bind(this);
    this._checkTime = this._checkTime.bind(this);
  }

  /**
   * Waits a number of seconds and then calls the given function.
   *
   * @param {number} seconds number of seconds to wait.
   * @param {function} callback function to be called after waiting.
   * @returns {void}
   */
  startCountdown = (seconds = 0, callback = null) => {
    this._countdownTime = seconds;
    this._callback = callback;
    this._subscription = setInterval(this._checkTime, 1000);

    this.resetCountdown();
  };

  /**
   * Resets the countdown.
   *
   * @returns {void}
   */
  resetCountdown() {
    this._cbTriggerTime = Date.now() + this._countdownTime * 1000;
  };

  /**
   * Clears the timer config.
   *
   * @returns {void}
   */
  clear() {
    this._countdownTime = 0;
    this._cbTriggerTime = Date.now();
    this._callback = null;
  };

  /**
   * Checks whether it is time to trigger the callback function.
   *
   * @private
   * @returns {void}
   */
  _checkTime() {
    const now = new Date();

    if (this._cbTriggerTime <= now) {
      clearInterval(this._subscription);

      if (this._callback) {
        this._callback();
      }
    }
  }
}


export default Timer;
