var destinations = [
	"https://grpcui-proxy.ingress.dev.m2.ru/",
	"https://grpcui-proxy.ingress.test.m2.ru/",
	"https://grpcui-proxy.ingress.stage.m2.ru/",
	"https://grpcui-proxy.ingress.prod.m2.ru/"
];

var ID_GRPC_REQ_RAW_TAB = 'grpc-request-raw-tab';
var ID_FULLSCREEN_GRPC_REQ_RAW_TEXT = 'fullscreen-grpc-request-raw-text';
var ID_BTN_OPEN_REQ_RAW = 'btn-grpc-request-raw-tab'
var ID_BTN_CLOSE_REQ_RAW = 'btn-close-grpc-request-raw-tab'
var RAW_REQ_TXT_BASE = 'textarea#grpc-request-raw-text';
var RAW_REQ_TXT_FULL = 'textarea#fullscreen-grpc-request-raw-text';
var RAW_REQ_BLOCK_FULL = 'div#fullscreen-grpc-request-raw-text';
var RAW_REQ_BTN_OPEN_FULLSCREEN = `div#${ID_BTN_OPEN_REQ_RAW}`;
var RAW_REQ_BTN_CLOSE_FULLSCREEN = `div#${ID_BTN_CLOSE_REQ_RAW}`;

var ID_REQ_RAW_TXT_BASE = 'grpc-request-raw-text';
var ID_REQ_RAW_TXT_FULL = 'grpc-request-raw-text-full';
var ID_REQ_RAW_BLOCK_PLAIN = 'grpc-request-raw-block-plain';
var ID_REQ_RAW_BLOCK_PRETTY = 'grpc-request-raw-block-pretty';
var ID_REQ_RAW_PRETTY = 'grpc-request-raw-pretty';

var ID_GRPC_REQ_RAW_BTN_EXP_PLAIN = `${ID_GRPC_REQ_RAW_TAB}-btn-expand-plain`;
var ID_GRPC_REQ_RAW_BTN_EXP_PRETTY = `${ID_GRPC_REQ_RAW_TAB}-btn-expand-pretty`;
var ID_GRPC_REQ_RAW_BTN_CLPS_PLAIN = `${ID_GRPC_REQ_RAW_TAB}-btn-collapse-plain`;
var ID_GRPC_REQ_RAW_BTN_CLPS_PRETTY = `${ID_GRPC_REQ_RAW_TAB}-btn-collapse-pretty`;
var ID_GRPC_REQ_RAW_BTN_COPY = `${ID_GRPC_REQ_RAW_TAB}-btn-copy`;
var ID_GRPC_REQ_RAW_BTN_CLEAR = `${ID_GRPC_REQ_RAW_TAB}-btn-clear`;

var ID_GRPC_RESP_TAB = 'grpc-response-tab';
var ID_GRPC_RESP_DATA = 'grpc-response-data'
var ID_GRPC_RESP_TEXT = 'grpc-response-textarea';
var ID_GRPC_RESP_BTN_OPEN = `${ID_GRPC_RESP_TAB}-btn-open`;
var ID_GRPC_RESP_BTN_CLOSE = `${ID_GRPC_RESP_TAB}-btn-close`;
var ID_GRPC_RESP_BTN_COPY = `${ID_GRPC_RESP_TAB}-btn-copy`;
var ID_GRPC_RESP_BTN_EXP_PRETTY = `${ID_GRPC_RESP_TAB}-btn-expand-pretty`;
var ID_GRPC_RESP_BTN_CLPS_PRETTY = `${ID_GRPC_RESP_TAB}-btn-collapse-pretty`;
var ID_GRPC_RESP_TAB_FULLSCREEN = `${ID_GRPC_RESP_TAB}-fullscreen`;
var ID_GRPC_RESP_BLOCK_PRETTY = 'grpc-response-block-pretty';
var TXT_GRPC_RESP_FULL = `textarea#${ID_GRPC_RESP_TAB_FULLSCREEN}`;
var DIV_GRPC_RESP_FULL = `div#${ID_GRPC_RESP_TAB_FULLSCREEN}`;

var service = '';
var method = '';

function print() {
	console.log('service:', service);
	console.log('method:', method);
}

function syncTextarea(srcID, dstID) {
	var src = `textarea#${srcID}`;
	var dst = `textarea#${dstID}`;
	
	$(dst).val(
		$(src).val()
	);
}
function syncTextareaFromClassToId(srcClass, dstID) {
	var src = `textarea.${srcClass}`;
	var dst = `textarea#${dstID}`;

	$(dst).val(
		$(src).val()
	);
}
function syncTextareaFromIdToClass(srcID, dstClass) {
	var src = `textarea#${srcID}`;
	var dst = `textarea.${dstClass}`;

	$(dst).val(
		$(src).val()
	);
}
function disableBlock(blockID) {
	$(`div#${blockID}`)
		.css('display', 'none');
}
function enableBlock(blockID) {
	$(`div#${blockID}`)
		.css('display', 'block');
}
function validatejson(data) {
	try {
		JSON.parse(data);
		$('#raw-valid-field').text('Valid JSON');
		$('#raw-valid-field').css('color', 'white');
		$('#raw-valid-field').css('background', 'green');

	} catch (e) {
		$('#raw-valid-field').text('Invalid JSON');
		$('#raw-valid-field').css('color', 'white');
		$('#raw-valid-field').css('background', '#f54242');
	}
}

$(document).ready(function() {
	var url = window.location.href;
	var checked = destinations.find((dest) => url.includes(dest));
	
	console.log('checked=', checked);

	if (checked) {
		$('body').ready(function(){
			var s = "select#grpc-service";
			service = $(s).val();
			$(s).change(
				function() {
					service = $(s).val();
					print();
				}
			);
		});

		$('body').ready(function(){
			var s = "select#grpc-method";
			method = $(s).val();
			$(s).change(
				function() {
					method = $(s).val();
					print();
				}
			);
		});
		
		// RAW REQUEST TAB
		
		// raw req: modal block (plain json)
		$('body')
			.append(
				`<div id='${ID_REQ_RAW_BLOCK_PLAIN}'>
					<div>
						<textarea id='${ID_REQ_RAW_TXT_FULL}'></textarea>
						<div class='txt-menu-bar txt-menu-bar-mrgn-clps'>
							<div id='${ID_GRPC_REQ_RAW_BTN_CLPS_PLAIN}'>collapse</div>
						</div>
					</div>
				</div>`
			);

		// raw req: modal block (pretty json)
		$('body')
			.append(
				`<div id='${ID_REQ_RAW_BLOCK_PRETTY}'>
					<div>
						<pre id='json-renderer1'></pre>
						<div class='txt-menu-bar txt-menu-bar-mrgn-clps60'>
							<div id='${ID_GRPC_REQ_RAW_BTN_CLPS_PRETTY}'>collapse</div>
						</div>
					</div>
				</div>`
			);
	
		// raw req: menu bar into textarea
		$(`div#${ID_GRPC_REQ_RAW_TAB}`)
			.append(
				`<div class='txt-menu-bar txt-menu-bar-mrgn-exp'>
					<div id='${ID_GRPC_REQ_RAW_BTN_EXP_PLAIN}' title='expand plain json'>plain</div>
					<div id='${ID_GRPC_REQ_RAW_BTN_EXP_PRETTY}' title='expand pretty json'>pretty</div>
					<div id='${ID_GRPC_REQ_RAW_BTN_COPY}' title='copy json to clipboard'>copy</div>
				</div>`
			);

		// raw req: expand block (plain json)
		$(`div#${ID_GRPC_REQ_RAW_BTN_EXP_PLAIN}`)
			.on('click', function(e) {
				syncTextarea(
					ID_REQ_RAW_TXT_BASE,
					ID_REQ_RAW_TXT_FULL
				);
				enableBlock(ID_REQ_RAW_BLOCK_PLAIN);
			});

		// raw req: collapse block (plain json)
		$(`div#${ID_GRPC_REQ_RAW_BTN_CLPS_PLAIN}`)
			.on('click', function(e) {
				syncTextarea(
					ID_REQ_RAW_TXT_FULL,
					ID_REQ_RAW_TXT_BASE
				);
				disableBlock(ID_REQ_RAW_BLOCK_PLAIN);
			});

		// raw req: copy to clipboard from textarea (base)
		$(`div#${ID_GRPC_REQ_RAW_BTN_COPY}`)
			.on('click', async function(e) {
				var data = $(`textarea#${ID_REQ_RAW_TXT_BASE}`).val();
				await navigator.clipboard.writeText(data);
				alert('Copied to clipboard!');
			});

		// raw req: expand block (pretty json)
		$(`div#${ID_GRPC_REQ_RAW_BTN_EXP_PRETTY}`)
			.on('click', function(e) {
				/*syncTextarea(
					ID_REQ_RAW_TXT_BASE,
					ID_REQ_RAW_TXT_FULL
				);*/
				var data = $(`textarea#${ID_REQ_RAW_TXT_BASE}`).val();
				var json = JSON.parse(data);
				console.log(json);
				$(`#json-renderer1`).jsonViewer(json);
				enableBlock(ID_REQ_RAW_BLOCK_PRETTY);
			});

		// raw req: collapse block (pretty json)
		$(`div#${ID_GRPC_REQ_RAW_BTN_CLPS_PRETTY}`)
			.on('click', function(e) {
				disableBlock(ID_REQ_RAW_BLOCK_PRETTY);
			});
		
		// raw req: valid block
		$(`div#grpc-request-raw-tab`)
			.append(`
				<div id='raw-valid-field'></div>
			`);

		$(`textarea#grpc-request-raw-text`)
			.on('input', function(e) {
				var data = $(`textarea#grpc-request-raw-text`).val();
				validatejson(data);
			});

		// RESPONSE TAB

		// resp: modal block (plain json)
		$('body')
			.append(`
				<div id='${ID_GRPC_RESP_TAB_FULLSCREEN}'>
					<div>
						<textarea id='${ID_GRPC_RESP_TAB_FULLSCREEN}'></textarea>
						<div class='txt-menu-bar txt-menu-bar-mrgn-clps60'>
							<div id='${ID_GRPC_RESP_BTN_CLOSE}'>{collapse}</div>
						</div>
					</div>
				</div>`
			);

		// resp: modal block (pretty json)
		$('body')
			.append(
				`<div id='${ID_GRPC_RESP_BLOCK_PRETTY}'>
					<div>
						<pre id='json-renderer'></pre>
						<div class='txt-menu-bar txt-menu-bar-mrgn-clps60'>
							<div id='${ID_GRPC_RESP_BTN_CLPS_PRETTY}'>collapse</div>
						</div>
					</div>
				</div>`
			);

		// resp: menu bar into textarea
		$(`div#${ID_GRPC_RESP_TAB}`)
			.append(
				`<div class='txt-menu-bar txt-menu-bar-mrgn-exp184'>
					<div id='${ID_GRPC_RESP_BTN_OPEN}' title='expand plain json'>plain</div>
					<div id='${ID_GRPC_RESP_BTN_EXP_PRETTY}' title='expand pretty json'>pretty</div>
					<div id='${ID_GRPC_RESP_BTN_COPY}' title='copy json to clipboard'>copy</div>
				</div>`
			);
		
		// resp: collapse block (plain json)
		$(`div#${ID_GRPC_RESP_BTN_CLOSE}`)
			.on('click', function(e) {
				syncTextareaFromIdToClass(
					ID_GRPC_RESP_TAB_FULLSCREEN,
					ID_GRPC_RESP_TEXT
				);
				disableBlock(ID_GRPC_RESP_TAB_FULLSCREEN);
			});

		// resp: expand block (plain json)
		$(`div#${ID_GRPC_RESP_BTN_OPEN}`)
			.on('click', function(e) {
				syncTextareaFromClassToId(
					ID_GRPC_RESP_TEXT,
					ID_GRPC_RESP_TAB_FULLSCREEN
				);
				enableBlock(ID_GRPC_RESP_TAB_FULLSCREEN);
			});

		// resp: copy to clipboard from textarea (base)
		$(`div#${ID_GRPC_RESP_BTN_COPY}`)
			.on('click', async function(e) {
				var data = $(`textarea.${ID_GRPC_RESP_TEXT}`).val(); // className!
				await navigator.clipboard.writeText(data);
				alert('Copied to clipboard!');
			});

		// resp: expand block (pretty json)
		$(`div#${ID_GRPC_RESP_BTN_EXP_PRETTY}`)
			.on('click', function(e) {
				var data = $(`textarea.${ID_GRPC_RESP_TEXT}`).val();
				var json = JSON.parse(data);
				//console.log(json);
				$(`#json-renderer`).jsonViewer(json);
				enableBlock(ID_GRPC_RESP_BLOCK_PRETTY);
			});

		// resp: collapse block (pretty json)
		$(`div#${ID_GRPC_RESP_BTN_CLPS_PRETTY}`)
			.on('click', function(e) {
				disableBlock(ID_GRPC_RESP_BLOCK_PRETTY);
			});
	}
});
