 
import showdown from 'showdown.js';
import HtmlToJson from 'html2json.js';
/**
 * 配置及公有属性
 **/
/**
 * 主函数入口区
 **/
 var arrs='';//数组名称
function wxParse(bindName = 'wxParseData', type='html', data='<div class="color:red;">数据不能为空</div>', target,imagePadding,arrName,idx) {
  var that = target;
  // <br />

//  console.log(data,'解析内容');
  var transData = {};//存放转化后的数据

  if (type == 'html') {
  
    if (arrName){
      transData = HtmlToJson.html2json(data, bindName, arrName, idx);
      }else{
   
      transData = HtmlToJson.html2json(data, bindName, 'wly', idx);
      }
    
    
  } else if (type == 'md' || type == 'markdown') {
    var converter = new showdown.Converter();
    var html = converter.makeHtml(data);
    transData = HtmlToJson.html2json(html, bindName,idx);

  }
  transData.view = {};
  transData.view.imagePadding = 0;
  if(typeof(imagePadding) != 'undefined'){
    transData.view.imagePadding = imagePadding
  }
  var bindData = {};
  bindData[bindName] = transData;
  that.setData(bindData)
  that.wxParseImgLoad = wxParseImgLoad;
  that.wxParseImgTap = wxParseImgTap;
  if (arrName)
    that.arrName = arrName;
 

}
 
// 图片点击事件
function wxParseImgTap(e) {
  var that = this;
  var nowImgUrl = e.target.dataset.src;
  var tagFrom = e.target.dataset.from;
  if (typeof (tagFrom) != 'undefined' && tagFrom.length > 0) {
    wx.previewImage({
      current: nowImgUrl, // 当前显示图片的http链接
      urls: [nowImgUrl] // 需要预览的图片http链接列表
    })
  }
}

/**
 * 图片视觉宽高计算函数区 
 **/
function wxParseImgLoad(e) {
 
  var that = this;
  var tagFrom = e.target.dataset.from;
  var idx = e.target.dataset.idx;
  if (typeof (tagFrom) != 'undefined' && tagFrom.length > 0) {
    var index;
    if (!isNaN(parseInt(tagFrom.substr(tagFrom.length - 1, 1)))){
      
    

    index = tagFrom.substr(tagFrom.length-1,1)
    calMoreImageInfo(e, idx, that, tagFrom, index)
    }else{
      console.log('图片宽高', tagFrom, idx, e,idx)
      calMoreImageInfo(e, idx, that, tagFrom)
    }
    
  } 
}
// 假循环获取计算图片视觉最佳宽高
 function  calMoreImageInfo(e, idx, that, bindName, index) {
   const { arr } = e.currentTarget.dataset;
  let sort = e.currentTarget.dataset.sort
  if (arr == 'compareArr'){
    var temData = that.data.ExamList ? that.data.ExamList[sort][arr] ? that.data.ExamList[sort][arr] : that.data[bindName] : that.data[bindName];
    var temImages = temData;
    var recal = wxAutoImageCal(e.detail.width, e.detail.height, that, bindName);
    temImages[index][0].width = recal.imageWidth;
    temImages[index][0].height = recal.imageheight;
    temData.images = temImages;

    that.setData({
      ['DataList[' + sort + '].' + arr]: temData
    })
  }else{
    var temData = that.data.ExamList ? that.data.ExamList[sort][bindName] ? that.data.ExamList[sort][bindName] : that.data[bindName] : that.data[bindName];
    // if (!temData || temData.images.length == 0) {
    //   return;
    // }
    var temImages = temData.images;
    //因为无法获取view宽度 需要自定义padding进行计算，稍后处理
    var recal = wxAutoImageCal(e.detail.width, e.detail.height, that, bindName);
    temImages[idx].width = recal.imageWidth;
    temImages[idx].height = recal.imageheight;
    temData.images = temImages;
    console.log(temData, '打印索引', recal)

    var bindData = {};
    bindData[bindName] = temData;
    const { arr } = e.currentTarget.dataset;
    console.log(index, 'index存在')
    if (index) {

      if (that.data.DataList) {
        that.setData({
          ['DataList[' + sort + '].' + arr + '[' + index + '][0].width']: temData.nodes[0].width
        })
      } else {
        that.setData({
          [arrs + '[' + index + ']']: temData.nodes
        })
      }
    } else {
      console.log(that.data.DataList, sort, arr, '显示消息')
      if (that.data.DataList) {
        that.data.DataList[sort][arr].nodes.map((item, i) => {

          if (item.tag === 'img') {
            that.setData({
              [`DataList[${sort}].${arr}.nodes[${i}].width`]: temData.nodes[i].width
            })
          }
        })
      } else {

        that.setData(bindData);
      }


    }
  }


  
  // else{
  //   that.setData(bindData);
  // }
 
    // that.updateData();
 
  // if (temData.arrName)
}

// 计算视觉优先的图片宽高
function wxAutoImageCal(originalWidth, originalHeight,that,bindName) {
  //获取图片的原始长宽
  var windowWidth = 0, windowHeight = 0;
  var autoWidth = 0, autoHeight = 0;
  var results = {};
  wx.getSystemInfo({
    success: function (res) {
      // var padding = that.data[bindName].view.imagePadding;
      windowWidth = res.windowWidth ;
      windowHeight = res.windowHeight;
      //判断按照那种方式进行缩放
     
      if (originalWidth > windowWidth) {//在图片width大于手机屏幕width时候
        autoWidth = windowWidth;
        autoHeight = (autoWidth * originalHeight) / originalWidth;
        results.imageWidth = autoWidth;
        results.imageheight = autoHeight;
      } else {//否则展示原来的数据
        results.imageWidth = originalWidth;
        results.imageheight = originalHeight;
      }
    }
  })
  return results;
}

function wxParseTemArray(temArrayName, bindNameReg, total, that, off){
  var array = []; 

  var temData = that.data;
  var obj = null;
  for(var i = 0; i < total; i++){
    var simArr = temData[bindNameReg+i].nodes;
    array.push(simArr);
  }
  if (!off)
  arrs = temArrayName;
  temArrayName = temArrayName || 'wxParseTemArray';
  obj = JSON.parse('{"'+ temArrayName +'":""}');
  obj[temArrayName] = array;
  that.setData(obj);
   
}

/**
 * 配置emojis
 * 
 */

function emojisInit(reg='',baseSrc="/wxParse/emojis/",emojis){
   HtmlToJson.emojisInit(reg,baseSrc,emojis);
}

module.exports = {
  wxParse: wxParse,
  wxParseTemArray:wxParseTemArray,
  emojisInit:emojisInit
}


