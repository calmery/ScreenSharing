( () => {
  const port = chrome.runtime.connect( chrome.runtime.id )

  port.onMessage.addListener( message => {
  	window.postMessage( message, '*' )
  } )

  window.addEventListener( 'message', event => {
  	if( event.source !== window || !event.data.type ){
      return
    }

  	if( ['PORCH_UI_REQUEST', 'PORCH_UI_CANCEL'].includes( event.data.type ) ){
  		port.postMessage( event.data )
  	}
  }, false )

  window.postMessage( {
    type: 'PORCH_PING',
    text: 'start'
  }, '*' )
} )()
