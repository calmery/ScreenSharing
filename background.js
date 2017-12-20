let desktopMediaRequestId = ''

const requestScreenSharing = ( port, message ) => {
  const sources = ['screen', 'window', 'tab', 'audio']
  const tab     = port.sender.tab

  desktopMediaRequestId = chrome.desktopCapture.chooseDesktopMedia( sources, port.sender.tab, streamId => {
    if( streamId ){
      message.type     = 'PORCH_DIALOG_SUCCESS'
      message.streamId = streamId
    } else {
      message.type = 'PORCH_DIALOG_CANCEL'
    }

    port.postMessage( message )
  } )
}

const cancelScreenSharing = _ => {
  if( desktopMediaRequestId ){
    chrome.desktopCapture.cancelChooseDesktopMedia( desktopMediaRequestId )
  }
}

chrome.windows.getAll( {
  populate: true
}, windows => {
  const details = {
    file: 'js/content-script.js',
    allFrames: true
  }

  ( array => [].concat.apply( [], array ) )( windows.map( window => window.tabs ) ).forEach( tab => {
    if( tab.url.match( /(chrome):\/\//gi ) ){
      return
    }

    chrome.tabs.executeScript( tab.id, details, () => {
      console.log( 'After injection in tab: ', tab )
    } )
  } )
} )

chrome.runtime.onConnect.addListener( port => {
  port.onMessage.addListener( message => {
    if( message.type === 'PORCH_UI_REQUEST' ){
      requestScreenSharing( port, message )
    } else if( message.type === 'PORCH_UI_CANCEL' ){
      cancelScreenSharing( message )
    }
  } )
} )
