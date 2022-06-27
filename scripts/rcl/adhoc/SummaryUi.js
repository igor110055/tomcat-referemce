
//-----------------------------------------------------------------------------
/**
 * I am an abstract base class for all ReportWizard related UI controllers
 * @constructor
 * @author - Lance Hankins (lhankins@focus-technologies.com)
 **/
function SummaryUiController (aDocument, aWizardReport, aPackageRoot, aPleaseWaitDiv)
{
   if (arguments.length > 0)
   {
      SummaryUiController.superclass.constructor.call(this, aDocument, aWizardReport, aPleaseWaitDiv);
   }
}

SummaryUiController.prototype = new AbstractReportWizardUiController();
SummaryUiController.prototype.constructor = SummaryUiController;
SummaryUiController.superclass = AbstractReportWizardUiController.prototype;

SummaryUiController.prototype.initializeUi = function()
{
   this.setStageTitle(applicationResources.getProperty("reportWizard.summary.stageTitle"));
   this.disableReportComplete();
   this.disableNext();
   this.initKeyHandler();
};

SummaryUiController.prototype.initKeyHandler = function()
{
   this.keyHandler = new ReportWizardKeyHandler(this);
};

