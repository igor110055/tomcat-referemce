// This function is used to tell the server
// to Finish a prompt page and run the report
// finish now: 'false'
// continue prompting: 'true'
function SetPromptContinue(setting)
{
   //alert("SetPromptContinue(" + setting + ")");


/*
   if (setting == false || setting == "false")
   {
      var submitUrl = "http://forge:8180/rcl/secure/actions/capturePromptValues/prompt.do";
      alert("resetting submit action to [" + submitUrl + "]");

      // TODO: hardcoded
      document.forms[0].action = submitUrl;
   }
*/

   if (document.forms[0]["run.prompt"])
	{
		document.forms[0]["run.prompt"].value = setting;
	}
	if (document.forms[0].prompt)
	{
		document.forms[0].prompt.value = setting;
	}
}