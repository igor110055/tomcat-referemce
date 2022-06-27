/**
    Copyright 2001-2008, Focus Technologies LLC.
    All rights reserved.
**/


// $Id: ReportInstance.js 8902 2014-06-25 12:30:32Z lhankins $



//-----------------------------------------------------------------------------
/**
 * I represent a single ReportOutput
 *
 * @param anId - the report output id
 * @param aFormat - the output format
 * @param aPageNum - the page number
 *
 * @constructor
 * @class
 * @author Lance Hankins (lhankins@focus-technologies.com)
 **/
function ReportOutput (anId, aFormat, aPageNum)
{
   this.id = anId;
   this.format = aFormat;
   this.pageNum = aPageNum;
   this.reportInstance = null;
}


ReportOutput.prototype.getUrl = function()
{

   if (this.reportInstance.isPaged())
   {
      //var url = ServerEnvironment.baseUrl + "/secure/reportOutputs/" + this.reportInstance.rerId + "/page/" + this.pageNum;
      var url = ServerEnvironment.baseUrl + "/secure/actions/viewReportOutput.do?" +
                "rerId=" + this.reportInstance.rerId +
                "&pageNum=" + this.pageNum +
                "&outputFormat=" + this.format;
   }
   else
   {
      var url = ServerEnvironment.baseUrl + "/secure/reportOutputs/" + this.reportInstance.rerId + "." +
                (this.format == 'spreadsheetML' ? 'xlsx' : this.format) + "." + this.id;

      // see ticket # 1102
      // var url = ServerEnvironment.baseUrl + "/secure/actions/viewReportOutput.do?rerId=" + this.reportInstance.rerId + "&outputFormat=" + this.format;

   }

   return url;
}


//-----------------------------------------------------------------------------
/**
 * I represent a report which has been run...
 *
 * @param anId - the report instance id
 * @param aRerId - the id of the associated RER
 * @param aName - the report instance name
 * @param aIsDrillInFrame
 * @param aExecutionStyle
 * @param aPagingStatus
 * @constructor
 * @class
 * @author Lance Hankins (lhankins@focus-technologies.com)
 **/
function ReportInstance (anId, aRerId, aName, aIsDrillInFrame, aExecutionStyle, aPagingStatus )
{
   this.id = anId;
   this.rerId = aRerId;
   this.name = aName;
   this.isDrillInFrame = aIsDrillInFrame;
   this.outputs = new Object();
   this.defaultFormat = 'HTML';

   this.currentOutput = null;
   this.currentPageNum = 0;
   this.executionStyle = aExecutionStyle;
   this.pagingStatus = aPagingStatus;
}

/**
 * unselect this item...
 **/
ReportInstance.prototype.addOutput = function (anOutput)
{
   var outputs = this.outputs[anOutput.format];

   if (!outputs) {
      outputs = [];
      this.outputs[anOutput.format] = outputs;
   }


   outputs.push(anOutput);

   anOutput.reportInstance = this;

//   if(anOutput.format == 'HTML')
//   {
//      var appendixOutput = new ReportOutput(anOutput.id,  'Appendix');
//      appendixOutput.reportInstance = this;
//      appendixOutput.htmlOutput = anOutput;
//      appendixOutput.getUrl = function ()
//      {
//         var url = this.htmlOutput.getUrl() + "#rclAppendix";
//         return url;
//      }
//      this.outputs[appendixOutput.format] = appendixOutput;
//   }
};


/**
 * get output by name...
 **/
ReportInstance.prototype.getOutput = function (aName)
{
   if (aName == 'XLS')
      aName = 'singleXls';

   if (aName == 'XLS (2007)')
      aName = 'spreadsheetML';

   return this.outputs[aName];
};

ReportInstance.formatsInPrecedence = ['HTML',
                                      'HTMLFragment',
                                      'XHTML',
                                      'MHT',
                                      'PAGED_HTML',
                                      'PDF',
                                      'spreadsheetML',
                                      'singleXLS',
                                      'XLWA',
                                      'xlsxData',
                                      'CSV',
                                      'XML',
                                      'layoutDataXML',
                                      'Appendix'];

ReportInstance.formatsDisplayValue = new Array();
ReportInstance.formatsDisplayValue['HTML'] = applicationResources.getProperty("reportInstance.format.html");
ReportInstance.formatsDisplayValue['PAGED_HTML'] = applicationResources.getProperty("reportInstance.format.pagedHtml");
ReportInstance.formatsDisplayValue['PDF'] = applicationResources.getProperty("reportInstance.format.pdf");
ReportInstance.formatsDisplayValue['singleXLS'] = applicationResources.getProperty("reportInstance.format.singleXLS");
ReportInstance.formatsDisplayValue['spreadsheetML'] = applicationResources.getProperty("reportInstance.format.spreadsheetML");
ReportInstance.formatsDisplayValue['CSV'] = applicationResources.getProperty("reportInstance.format.csv");
ReportInstance.formatsDisplayValue['XML'] = applicationResources.getProperty("reportInstance.format.xml");
ReportInstance.formatsDisplayValue['MHT'] = applicationResources.getProperty("reportInstance.format.mht");
ReportInstance.formatsDisplayValue['XLWA'] = applicationResources.getProperty("reportInstance.format.xlwa");
ReportInstance.formatsDisplayValue['xlsxData'] = applicationResources.getProperty("reportInstance.format.xlsxData");
ReportInstance.formatsDisplayValue['XHTML'] = applicationResources.getProperty("reportInstance.format.xhtml");
ReportInstance.formatsDisplayValue['HTMLFragment'] = applicationResources.getProperty("reportInstance.format.htmlFragment");
ReportInstance.formatsDisplayValue['layoutDataXML'] = applicationResources.getProperty("reportInstance.format.layoutDataXML");
ReportInstance.formatsDisplayValue['Appendix'] = applicationResources.getProperty("reportInstance.format.appendix");

/**
 * returns the default output format for this ReportInstance.
 **/
ReportInstance.prototype.getDefaultOutput = function()
{
   var output = this.getOutput(this.defaultFormat);
   if (output)
   {
      this.currentOutput = output[this.currentPageNum];
      return this.currentOutput;
   }

   var eachFormat;
   for (var i = 0; i < ReportInstance.formatsInPrecedence.length; ++i)
   {
      eachFormat = ReportInstance.formatsInPrecedence[i];

      output = this.getOutput(eachFormat);
      if (output)
      {
         this.currentOutput = output[this.currentPageNum];     // TODO: Kind of hacky to set this here...
         return this.currentOutput;
      }
   }
};

ReportInstance.prototype.updatePagingStatus = function(aPagingStatus, aTotalPages)
{
   this.pagingStatus = aPagingStatus;

   var pagedOutputs = this.getOutput('PAGED_HTML');

   var startingSize = pagedOutputs.length;

   var newReportOutput;
   for (var i = 0; i < (aTotalPages - startingSize); ++i)
   {
      newReportOutput = new ReportOutput(null, 'PAGED_HTML',startingSize +i )
      newReportOutput.reportInstance = this;

      pagedOutputs.push(newReportOutput);
   }
};


/**
 * @returns true if this ReportInstance has paged output (HTML output format which is paged)
 */
ReportInstance.prototype.isPaged = function()
{
   return this.executionStyle === ReportExecutionStyleEnum.PAGED_OUTPUT.name;
//   var output = this.getOutput('HTML');
//   return output && output.length > 1;
};

/**
 * @returns Number if this ReportInstance has paged output (HTML output format which is paged)
 */
ReportInstance.prototype.getTotalNumberOfPages = function()
{
   var output = this.getOutput('PAGED_HTML');

   return output ? output.length : 1;
};


/**
 * @returns true if the nextPage operation is allowed
 */
ReportInstance.prototype.isNextPageAllowed = function()
{
   var output = this.getOutput('PAGED_HTML');
   return output && (this.currentPageNum+1) < output.length;
};

/**
 * @returns true if the previousPage operation is allowed
 */
ReportInstance.prototype.isPreviousPageAllowed = function()
{
   var output = this.getOutput('PAGED_HTML');
   return output && (this.currentPageNum-1) >= 0;
};

/**
 * sets current output
 */
ReportInstance.prototype.resetCurrentOutput = function()
{
   this.currentOutput = this.getOutput('PAGED_HTML')[this.currentPageNum];
};



/**
 * sets current page number to 0
 * @returns {number} the new current  page number (0 based)
 */
ReportInstance.prototype.firstPage = function()
{
   this.currentPageNum = 0;
   this.resetCurrentOutput();
   return this.currentPageNum;
};


/**
 * increments the current page number (if allowed)
 * @returns {number} the new current  page number (0 based)
 */
ReportInstance.prototype.nextPage = function()
{
   if (this.isNextPageAllowed()) this.currentPageNum++;

   this.resetCurrentOutput();
   return this.currentPageNum;
};

/**
 * decrements the current page number (if allowed)
 * @returns {number} the new current  page number (0 based)
 */
ReportInstance.prototype.previousPage = function()
{
   if (this.isPreviousPageAllowed()) this.currentPageNum--;

   this.resetCurrentOutput();
   return this.currentPageNum;
};


/**
 * sets current page number to last avail
 * @returns {number} the new current  page number (0 based)
 */
ReportInstance.prototype.lastPage = function()
{
   this.currentPageNum = this.getOutput('PAGED_HTML').length -1;
   this.resetCurrentOutput();
   return this.currentPageNum;
};



/**
 * @returns {number} the new current  page number (0 based)
 */
ReportInstance.prototype.jumpToPage = function(aPage)
{
   var maxPage = this.getOutput('PAGED_HTML').length -1;

   if (aPage < 0) aPage = 0;
   if (aPage > maxPage) aPage = maxPage;

   this.currentPageNum = aPage;
   this.resetCurrentOutput();
   return this.currentPageNum;
};




/**
 *
 * @returns {boolean} true if a paged report is still loading
 */
ReportInstance.prototype.isStillLoading = function()
{
   //alert("this.pagingStatus = [" + this.pagingStatus + "]");
   return this.pagingStatus === ReportExecutionPagingStatusEnum.IN_PROGRESS.name;
};


/**
 * @returns {boolean} true if a paged report reached its maxPages
 */
ReportInstance.prototype.isReachedMaxPages = function()
{
   //alert("this.pagingStatus = [" + this.pagingStatus + "]");
   return this.pagingStatus === ReportExecutionPagingStatusEnum.REACHED_MAX_PAGES.name;
};



