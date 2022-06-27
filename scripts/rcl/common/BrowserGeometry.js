
/**
 * I represent a browser window's basic geometry
 *
 * @author Lance Hankins
 *
 **/

function BrowserGeometry()
{
   this.width = 0;
   this.height = 0;
   this.top = 0;
   this.left = 0;

   this.refreshGeometry();
}

BrowserGeometry.prototype.refreshGeometry = function()
{
   var rootWindow = top.window;

   if ( typeof( rootWindow.innerWidth ) == 'number' )
   {
      //Non-IE
      this.width = rootWindow.innerWidth;
      this.height = rootWindow.innerHeight;
      this.top = rootWindow.screenY;
      this.left = rootWindow.screenX;

   }
   else
   {
      if( document.documentElement && (document.documentElement.clientWidth || document.documentElement.clientHeight ) )
      {
         //IE 6+ in 'standards compliant mode'
         this.width = document.documentElement.clientWidth;
         this.height = document.documentElement.clientHeight;
         this.top = rootWindow.screenTop;
         this.left = rootWindow.screenLeft;
      }
      else
      {
         if( document.body && ( document.body.clientWidth || document.body.clientHeight ) )
         {
            //IE 4 compatible
            this.width = document.body.clientWidth;
            this.height = document.body.clientHeight;
            this.top = rootWindow.screenTop;
            this.left = rootWindow.screenLeft;
         }
      }
   }
}
