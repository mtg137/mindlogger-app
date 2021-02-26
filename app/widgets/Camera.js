import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Image,
  TouchableOpacity,
  Platform,
  StyleSheet,
  Alert,
} from 'react-native';
import { View, Icon , Item , Input } from 'native-base';
import * as ImagePicker from 'react-native-image-picker';
import i18n from 'i18next';
import RNFetchBlob from 'rn-fetch-blob';
import permissions from '../permissions';

const VIDEO_MIME_TYPE = Platform.OS === 'ios' ? 'video/quicktime' : 'video/mp4';
const styles = StyleSheet.create({
  body: {
    flex: 1,
  },
  camera: {
    width: '100%',
    flex: 1,
    position: 'relative',
  },
  buttonText: {
    fontSize: 24,
    fontWeight: '300',
  },
  takeButton: {
    borderRadius: 12,
    width: '100%',
    height: 360,
    alignContent: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: '#d10000',
    backgroundColor: '#ffdddd',
  },
  videoConfirmed: {
    borderRadius: 12,
    width: '100%',
    height: 360,
    alignContent: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: '#00a30a',
    backgroundColor: '#99ff9f',
  },
  chooseButton: {
    borderRadius: 12,
    width: '100%',
    height: 116,
    alignContent: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: '#000000',
    backgroundColor: '#dbdbdb',
    marginTop: 8,
  },
  redIcon: {
    color: '#d10000',
    fontSize: 60,
  },
  greenIcon: {
    color: '#00a30a',
    fontSize: 60,
  },
  image: {
    height: 360,
    width: '100%',
    backgroundColor: 'black',
    resizeMode: 'contain',
  },
});
export class Camera extends Component {
  isIos = Platform.OS === 'ios';

  finalAnswer = [];

  handleComment = (itemValue) => {
    const {onChange} = this.props;
    this.finalAnswer["text"] = itemValue;
    /*onChange(this.finalAnswer);*/
  }

  libraryAlert = () => {
    const { video } = this.props;
    const mediaType = video ? 'video' : 'photo';

    Alert.alert(
      `${i18n.t('camera:choose')} ${mediaType}`,
      `${i18n.t('camera:take_a_new')} ${mediaType} ${i18n.t(
        'camera:or_choose',
      )}`,
      [
        {
          text: i18n.t('camera:camera'),
          onPress: () => {
            permissions.checkCameraPermission().then(() => {
              if (video) {
                this.take();
              } else {
                this.launchCamForCam();
              }
            });
          },
        },
        {
          text: i18n.t('camera:library'),
          onPress: () => {
            permissions.checkGalleryPermission().then(() => { this.launchImageLibrary(); });
          },
        },
      ],
      { cancelable: true },
    );
  };

  launchImageLibrary = () => {
    const { video } = this.props;
    const options = {
      mediaType: video ? 'video' : 'photo',
      videoQuality: 'low',
      quality: 0.1,
      maxWidth: 800,
      maxHeight: 800,
    };
    ImagePicker.launchImageLibrary(options, (response) => {
      console.log('launchImageLibrary', { response });
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.errorCode) {
        console.log('ImagePicker Error: ', response.errorCode);
      }
      if (!response.didCancel && !response.errorCode) {
        const { onChange } = this.props;
        const uri = response.uri.replace('file://', '');
        let filename = response.fileName;
        if (!filename) {
          filename = uri.split('/').pop();
        }

        if (!response.fileSize && uri.indexOf('content://') === -1) {
          RNFetchBlob.fs.stat(uri).then((fileInfo) => {
            const picSource = {
              uri,
              filename,
              size: fileInfo.size,
              type: response.type || VIDEO_MIME_TYPE,
              fromLibrary: false,
            };
            console.log('launchImageLibrary', { picSource });
            onChange(picSource);
          });
        } else {
          const picSource = {
            uri,
            filename,
            size: response.fileSize,
            type: response.type || VIDEO_MIME_TYPE,
            fromLibrary: true,
          };
          console.log('launchImageLibrary', { picSource });
          onChange(picSource);
        }
      }
    });
  };

  launchCamForCam = () => {
    const options = {
      mediaType: 'photo',
      // saveToPhotos: true,
      maxWidth: 800,
      maxHeight: 800,
      quality: 0.5,
    };
    ImagePicker.launchCamera(options, (response) => {
      const { onChange } = this.props;
      console.log('launchCamForCam', { options, response });
      if (response.errorCode) {
        Alert.alert(response.errorCode.indexOf('other') > -1 ? response.errorMessage : response.errorCode);
      }
      if (!response.didCancel && !response.errorCode) {
        const uri = response.uri.replace('file://', '');
        const filename = response.fileName;
        const picSource = {
          uri,
          filename,
          type: response.type || VIDEO_MIME_TYPE,
          size: response.fileSize,
          fromLibrary: false,
        };
        console.log('launchCamForCam', { picSource });
        onChange(picSource);
      }
    });
  };

  take = () => {
    try {
      const { video, onChange, config } = this.props;
      console.log({ video });
      const options = {
        mediaType: 'video',
        videoQuality: 'low',
        durationLimit: 60,
        // saveToPhotos: true,
      };
      if (config.allowLibrary) {
        permissions.checkGalleryPermission().then(() => { this.launchImageLibrary(); });
      } else {
        ImagePicker.launchCamera(options, (response) => {
          console.log(response, 'video response');
          if (response.errorCode) {
            Alert.alert(response.errorCode.indexOf('other') > -1 ? response.errorMessage : response.errorCode);
          }
          if (!response.didCancel && !response.errorCode) {
            const uri = response.uri.replace('file://', '');
            let filename = response.fileName;
            if (!filename) {
              filename = uri.split('/').pop();
            }
            if (!response.fileSize && uri.indexOf('content://') === -1) {
              RNFetchBlob.fs.stat(uri).then((fileInfo) => {
                const picSource = {
                  uri,
                  filename,
                  size: fileInfo.size,
                  type: response.type || VIDEO_MIME_TYPE,
                  fromLibrary: false,
                };
                console.log('take', { picSource });
                onChange(picSource);
              });
            } else {
              const picSource = {
                uri,
                filename,
                size: response.fileSize,
                type: response.type || VIDEO_MIME_TYPE,
                fromLibrary: false,
              };
              console.log('take', { picSource });
              onChange(picSource);
            }
          }
        });
      }
    } catch (error) {
      console.log({ error });
    }
  };

  render() {
    const { value, video ,isOptionalText} = this.props;

    this.finalAnswer = value ? value :[];
    // console.log({ v: value });
    const iconName = video ? 'video-camera' : 'camera';
    // this.getImageFromCamera();
    return (
      <View style={styles.body}>
        {value && video && (
          <View style={styles.videoConfirmed}>
            <Icon type="Entypo" name="check" style={styles.greenIcon} />
          </View>
        )}
        {value && !video && <Image source={value} style={styles.image} />}
        {!value && (
          <View>
            <TouchableOpacity
              onPress={this.libraryAlert}
              style={styles.takeButton}
            >
              <Icon type="Entypo" name={iconName} style={styles.redIcon} />
            </TouchableOpacity>
          </View>
        )}

        {isOptionalText ? 
      (<View    style={{
                    marginTop: '8%' ,
                    justifyContent: 'center',
                  }}
                  >
      <Item bordered>
      <Input 
          onChangeText={text=>this.handleComment(text)}
          value={this.finalAnswer["text"]}
      />
      </Item> 
    </View>
    ):<View></View>
      }
      </View>
    );
  }
}
Camera.defaultProps = {
  value: undefined,
  video: false,
  config: {
    allowLibrary: true,
  },
};
Camera.propTypes = {
  video: PropTypes.bool,
  value: PropTypes.shape({
    uri: PropTypes.string,
  }),
  config: PropTypes.shape({
    allowLibrary: PropTypes.bool,
  }),
  onChange: PropTypes.func.isRequired,
};
