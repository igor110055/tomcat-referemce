
//-----------------------------------------------------------------------------
/**
 * I am an abstract base class for all ReportWizard related UI controllers
 * @constructor
 * @author - Lance Hankins (lhankins@focus-technologies.com)
 **/
function SelectTypeUiController (aDocument, aWizardReport, aPackageRoot, aPleaseWaitDiv)
{
   if (arguments.length > 0)
   {
      SelectTypeUiController.superclass.constructor.call(this, aDocument, aWizardReport, aPleaseWaitDiv);
   }
}

SelectTypeUiController.prototype = new AbstractReportWizardUiController();
SelectTypeUiController.prototype.constructor = SelectTypeUiController;
SelectTypeUiController.superclass = AbstractReportWizardUiController.prototype;

SelectTypeUiController.prototype.initializeUi = function()
{
   this.setStageTitle(applicationResources.getProperty("reportWizard.selectType.stageTitle"));
   this.disablePrevious();
   this.disableReportComplete();
   this.initKeyHandler();
};

SelectTypeUiController.prototype.initKeyHandler = function()
{            
   this.keyHandler = new ReportWizardKeyHandler(this);
};

