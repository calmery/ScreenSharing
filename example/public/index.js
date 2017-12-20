window.addEventListener( 'message', event => {
  if( event.data.type && event.data.type === 'PORCH_PING' ){
    window.postMessage( {
      type: 'PORCH_UI_REQUEST',
      text: 'start'
    }, '*' )
  }

  if( event.data.type && event.data.type === 'PORCH_DIALOG_SUCCESS' ){
    navigator.mediaDevices.getUserMedia( {
      audio: {
        mandatory: {
          chromeMediaSource: 'desktop',
          chromeMediaSourceId: event.data.streamId,
          echoCancellation: true
        },
      },
      video: {
        mandatory: {
          chromeMediaSource: 'desktop',
          chromeMediaSourceId: event.data.streamId,
          maxWidth: window.screen.width,
          maxHeight: window.screen.height
        }
      }
    } )
      .then( stream => {
        document.getElementById( 'media' ).srcObject = stream
      } )
      .catch( console.error )
  }

  if( event.data.type && ( event.data.type === 'PORCH_DIALOG_CANCEL' ) ){
    console.log( 'Cancelled' )
  }
} )
