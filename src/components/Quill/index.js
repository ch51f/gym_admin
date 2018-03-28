import React, {Component} from 'react';
import {connect} from 'dva';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

import {isJsonString} from '../../utils/utils';
import {dataURI2Blob} from '../../utils/dataUri2Blob';

@connect(({system, gym}) => ({
  notice: system.notice,
}))
export default class Section extends Component {
  state = {
  	theme: 'snow',
  	enabled: true,
  	readOnly: false,
  	value: {ops: []},
  	events: []
  }

  setData() {
    let value = {ops: []}
    let {content, gym_company_config, notice} = this.props;
    if(content == 'notice') {
      if(isJsonString(notice.content)) {
        value = JSON.parse(notice.content);
      } else {
        value = {ops: [{insert: ""}]}
      }
    }
    console.log(value)

     // this.props.dispatch({
    //   type: 'login/upload',
    //   payload: {ext: dataURL2Blob(dataUri).type.split('/')[1],sizes: '50_50',file: dataURL2Blob(dataUri)}
    // })

    this.setState({value: value})
  }

  onToggle = () => {
  	this.setState({enabled: !this.state.enabled})
  }

  onToggleReadOnly = () => {
  	this.setState({readOnly: !this.state.readOnly})
  }

  onEditorChange = (value, delta, source, editor) => {
  	this.setState({
  		value: editor.getContents(),
  		events: [
  			'text-change('+this.state.value+' -> '+value+')'
  		].concat(this.state.events)
  	});
  	// console.log(editor.getContents())
   //  console.log(JSON.stringify(editor.getContents()))
   //  console.log(JSON.parse(JSON.stringify(editor.getContents())))
    this.props.change(JSON.stringify(editor.getContents()), value, editor.getText());
  	// this.props.change(value);
  }

  onEditorChangeSelection = (range, source) => {
  	this.setState({
  		selection: range,
  		events: [
				'selection-change('+
					this.formatRange(this.state.selection)
				+' -> '+
					this.formatRange(range)
				+')'
			].concat(this.state.events)
  	})
  }

  onEditorFocus = (range, source) => {
		this.setState({
			events: [
				'focus('+this.formatRange(range)+')'
			].concat(this.state.events)
		});
	}

	onEditorBlur = (previousRange, source) => {
		this.setState({
			events: [
				'blur('+this.formatRange(previousRange)+')'
			].concat(this.state.events)
		});
	}

  formatRange = (range) => {
  	return range ? [range.index, range.index + range.length].join(',') : 'none';
  }

  renderToolbar = () => {
  	let {enabled, readOnly, selection: sel} = this.state;
  	let selection = this.formatRange(sel);

  	return (
  		<div>
  			<button onClick={this.onToggle.bind(this)}>{enabled ? 'Disable' : 'Enable'}</button>
  			<button onClick={this.onToggleReadOnly.bind(this)}>{"Set " + (readOnly ? 'read/Write' : 'read-only')}</button>
  			<button disabled={true}>{'Selection: (' + selection + ')'}</button>
  		</div>
  	)
  }

  renderSidebar = () => {
  	return (
  		<div style={{overflow:'hidden', float:'right'}}>
  			<textarea style={{ display:'block', width:300, height:300 }} value={JSON.stringify(this.state.value, null, 2)} readOnly={true}></textarea>
  			<textarea style={{ display:'block', width:300, height:300 }} value={this.state.events.join('\n')} readOnly={true}></textarea>
  		</div>
  	)
  }

	render() {
    let value = {ops: [{insert: ""}]}
		let {theme, readOnly} = this.state;
    let {content, gym_company_config, notice} = this.props;
    if(content == 'gym') {
      if(isJsonString(gym_company_config.gym_desc)) {
        value = JSON.parse(gym_company_config.gym_desc);
      }
    } else if(content == 'notice') {
      if(isJsonString(notice.content)) {
        value = JSON.parse(notice.content);
      }
    }
    let modules = {
      toolbar: [
        [{ 'header': '1'}, {'header': '2'}, { 'font': [] }], 
        [{size: []}], 
        ['bold', 'italic', 'underline', 'strike', 'blockquote'], 
        [{'list': 'ordered'}, {'list': 'bullet'}, 
        {'indent': '-1'}, {'indent': '+1'}], 
        ['link', 'image'], 
        ['clean'] 
      ], 
      clipboard: {
        // toggle to add extra line breaks when pasting HTML: 
        matchVisual: false, 
      } 
    }
    let formats = [
      'header', 'font', 'size',
      'bold', 'italic', 'underline', 'strike', 'blockquote',
      'list', 'bullet', 'indent',
      'link', 'image', 'video'
    ]

		return (
			<div style={{lineHeight: 1}}>
				<ReactQuill 
					theme={theme} 
          modules={modules}
          formats={formats}

					value={value} 
					readOnly={readOnly} 
					onChange={this.onEditorChange}
					onChangeSelection={this.onEditorChangeSelection}
					onFocus={this.onEditorFocus}
					onBlur={this.onEditorBlur}
          placeholder="输入通知内容"
				/>
			</div>
		)
	}
}