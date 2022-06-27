
CognosFacade = Ext.extend(Ext.util.Observable,
                          /**
     * @lends CognosFacade.prototype
     */{

            /**
             * @constructs
             * @param config
             */
    constructor : function(config)
    {
        if (Ext.isDefined(config))
        {
            this.addEvents({
                               /**
                                * @name CognosFacade#beforesubmit
                                * @event
                                *Fires before a report is executed
                                * @param {ExecutionInputs} aInputs
                                */
                               'beforesubmit' : true,
                               /**
                                * @name CognosFacade#submitted
                                * @event
                                *Fires before a report is executed
                                * @param {Number} rerId the request number.  This can be used to cancel and track the request
                                * @param {ExecutionInputs} aInputs
                                */
                               'submitted' : true,
                               /**
                                * @name CognosFacade#working
                                * @event
                                *Fires while a report is executing. That is as long as the report request is not in a
                                * final state.
                                * @param {Number} rerId the request number.  This can be used to cancel and track the request
                                * @param {String} stage the enumerated phase of the request
                                */
                               'working' : true,
                               /**
                                * @name CognosFacade#failed
                                * @event
                                * Fires when a request returns with a final and unsuccessful status
                                * @param {Number} rerId the request number.  This can be used to cancel and track the request
                                * @param {String} stage the enumerated phase of the request
                                */
                               'failed' : true,
                               /**
                                * @name CognosFacade#success
                                * @event
                                * Fires when a request returns with a final and successful status
                                * @param {Number} rerId the request number.  This can be used to cancel and track the request
                                * @param {String} stage the enumerated phase of the request
                                */
                               'success' : true,
                               /**
                                * @name CognosFacade#complete
                                * @event
                                * Fires when a request returns with a final status regardless of whether it is successful or unsucessful
                                * @param {Number} rerId the request number.  This can be used to cancel and track the request
                                * @param {String} stage the enumerated phase of the request
                                */
                               'comnplete' : true,
                               /**
                                * @name CognosFacade#beforeoutput
                                * @event
                                * Fires before a remote call to get report output
                                * @param {Number} rerId the request number.  This can be used to cancel and track the request
                                * @param {String} fmt the output format that will be returned
                                */
                               'beforeoutput' : true,
                               /**
                                * @name CognosFacade#afteroutput
                                * @event
                                * Fires after a remote call to get report output
                                * @param {Number} rerId the request number.  This can be used to cancel and track the request
                                * @param {String} fmt the output format that will be returned
                                */

                               'afteroutput'  : true

                           });
            /**
             * @ignore
             */
            this.listeners = config.listeners;

        }


        //matches the first string between forward slashes in the pathname
        this.context = location.pathname.match(/\/[\w\d]+\//);
        this.executePath = this.context + 'rs/report/execute';
        this.statusPath = this.context + 'rs/report/status';
        this.outputPath = this.context + 'rs/report/output';
        this.adfUrl = location.protocol + '//' + location.hostname + ':' + location.port;

        CognosFacade.superclass.constructor.call(this, config);
    },



    /**
     * Continually monitors the status of a report execution request.  When a report request is in process this will
     * fire every 3 seconds.  When a final status is obtained the appropriate events will be fired.  If they return true
     * then the success callback will be passed control
     * @param rerId the report request that is the subject of the status check
     * @param aCallback a function that should be called upon the success of the status return.  The callback will pass
     * the response and options from the original request
     */
    checkStatus : function(rerId, aCallback)
    {
        var restPath = this.adfUrl + this.statusPath + '/' + rerId;


        //console.log('checking status for ' + restPath);
        //this seems like a sketchy implementation.  We could probably use a XmlReader/Store
        RequestUtil.request({

                             method : 'GET',
                             url : restPath,
                             scope: this,
                             success : function (response, options)
                             {
                                 var category = Ext.DomQuery.selectValue('status@category', response.responseXML);
                                 var stage = Ext.DomQuery.selectValue('status@stage', response.responseXML);
                                 var success = Ext.DomQuery.selectValue('status@success', response.responseXML);

                                 if (category == 'working')
                                 {
                                     this.fireEvent('working', [rerId, stage]);
                                     var fn = this.checkStatus;
                                     fn.defer(3000, this, [rerId,aCallback])
                                 }
                                 else
                                 {
                                     var go = this.fireEvent('complete', [rerId, stage]);
                                     if (success)
                                         go = this.fireEvent('success', [rerId, stage]);
                                     else
                                     {
                                         this.fireEvent('failed', [rerId, stage]);
                                         //TODO should return something meaningful other than void
                                         return;
                                     }

                                     if (go && (aCallback != null))
                                     {
                                         aCallback.apply(this, [rerId, response, options]);
                                     }
                                 }


                             },
                             failure : function (response, options)
                             {
                                 console.info('unable to get status for ' + rerId)
                             }

                         });

    },

    /**
     *
     * Executes a cognos report and checks the status of the report until complete.  Here is an example of a call that
     * would execute a report in xml and as a result of a successful completion returns the XML output of the report.
     *
     * <p>
     * <code>var facade = new CognosFacade();
     var format = 'XML'
     var inputs = {inputs : {"@format" : format, path : 'root/customers/ExampleCustomer/public/content/ADF Examples/Margin by Product Line - Bar Chart'}};

     function getOutput(rer,response, options)
     {
     facade.getOutput(rer, format, function(){return response.responseXml;})
     }
     facade.executeReport(inputs, getOutput);</code>          </p>

     * @param {ExecutionInputs} aInputs The properties of the request.
     * @param aCallback (optional) a function which will be called when a report returns a sucessful final status
     */
    executeReport : function(aInputs, aCallback)
    {
        var restPath = this.adfUrl + this.executePath;
        var rerId;

        var options = {
            method : 'POST',
            url : restPath,
            scope: this,
            jsonData : aInputs,
            success:function(response, options)
            {

                inputs = options.jsonData.inputs;

                try
                {
                    rerId = Ext.DomQuery.selectValue('launchReportResult/rerId', response.responseXML);
                    this.fireEvent('submitted', [rerId, inputs]);
                    if (aCallback != null)
                        this.checkStatus(rerId, aCallback);
                }
                catch(e)
                {
                    console.info('Exception caught after attempt to decode response =', response.responseText);
                    return;
                }


            },

            failure:function(response, options)
            {
                console.info('inside "failure" callback');
            }//end 'failure'


        };//end Ajax request config

        this.fireEvent('beforesubmit', [aInputs]);
        RequestUtil.request(options);
    },

    /**
     *
     * @param rerId The request for which output shall be returned.  This is obtained as a return value
     * @param format
     * @param aCallback : Function (Optional)
     The function
     * to be called upon success of the request. The callback is passed the following
     * parameters:

     *
     response : Object
     The XMLHttpRequest object containing the response data.

     *
     options : Object
     The parameter to the request call.
     */
    getOutput : function(rerId, format, aCallback)
    {
        var outputPath = this.adfUrl + this.outputPath + '/' + rerId + '/' + format + '/' + rerId;
        //console.log('getting output from ' + outputPath);
        if (this.fireEvent('beforeoutput', [rerId, format]))
        {

            RequestUtil.request({

                                 method : 'GET',
                                 url : outputPath,
                                 scope: this,
                                 success : function (response, options)
                                 {
                                     this.fireEvent('afteroutput', [rerId, format]);
                                     aCallback.call(this, response, options);
                                 },
                                 failure : function (response, options)
                                 {
                                     console.info('unable to get output for ' + rerId)
                                 }

                             });
        }
    }

});

INITIAL = {category : 'working', val : 'INITIAL'};
PENDING_PRE_EXECUTION = {category : 'working', val : 'PENDING_PRE_EXECUTION'};
PRE_EXECUTION = {category : 'working', val : 'PRE_EXECUTION'};
PENDING_EXECUTION = {category : 'working', val : 'PENDING_EXECUTION'};
EXECUTING = {category : 'working', val : 'EXECUTING'};
PENDING_DOWNLOAD = {category : 'working', val : 'PENDING_DOWNLOAD'};
DOWNLOADING_OUTPUTS = {category : 'working', val : 'DOWNLOADING_OUTPUTS'};
PENDING_POST_EXECUTION = {category : 'working', val : 'PENDING_POST_EXECUTION'};
POST_EXECUTION = {category : 'working', val :  'POST_EXECUTION'};
FINISHED = {category : 'final', val : 'FINISHED'};
INTERRUPTED = {category : 'final', val : 'INTERRUPTED'};
FAILED = {category : 'final', val : 'FAILED'};
CANCELLED = {category : 'final', val : 'CANCELLED'};


CognosFacade.XML = 'XML';
CognosFacade.LDX = 'layoutDataXML';
CognosFacade.HTML = 'HTML';
CognosFacade.PDF = 'PDF';





