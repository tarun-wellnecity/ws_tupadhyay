/* globals Shared */

(function() {

  Shared.AppC = Trillo.inherits(Trillo.Controller, function(viewSpec) {
    Trillo.Controller.call(this, viewSpec);
    this.toogleSidebarM = $.proxy(this.toogleSidebar, this);
    this.toogleNavbarM = $.proxy(this.toogleNavbar, this);
  });

  var AppC = Shared.AppC.prototype;
  var Controller = Trillo.Controller.prototype;

  AppC.handleAction = function(actionName, selectedObj, $e, targetController) {
    var formName = null;
    var data = null;
    var postUrl = null;
    if (actionName === "_logout") {
      Trillo.sessionStorage.removeItem("_trillo-access-token_");
      window.location.replace((Trillo.appContext.orgName ? Trillo.appContext.orgName + "/" : "") + "_logout");
      return true;
    } else if (actionName === "myProfile") {
      formName = "MyProfileForm";
      postUrl = "/_service/um/editUser";
      data = this.appCtx().user;
    } else if (actionName === "changeMyPassword") {
      formName = "PasswordForm";
      postUrl = "/_service/um/changePassword";
      data = this.appCtx().user;
    }
    if (formName) {
      this.showView({
        name : formName,
        postUrl : postUrl,
        type : Trillo.ViewType.Form,
        container : 'trillo-dialog-container',
        data : data
      });
      return true;
    }
    return Controller.handleAction.call(this, actionName, selectedObj, $e, targetController);
  };

  AppC.postViewShown = function(view) {
    if (view.name === "header") {
      $(".sidebartoggler").off('click', this.toogleSidebarM).on('click', this.toogleSidebarM);
      $(".nav-toggler").off('click', this.toogleNavbarM).on('click', this.toogleNavbarM);
      this.doWindowResized();
    }
    Controller.postViewShown.call(this, view);
  };

  AppC.toogleSidebar = function(view) {
    if ($("body").hasClass("no-sidebar")) {
      return;
    }
    if ($("body").hasClass("mini-sidebar")) {
      $("body").removeClass("mini-sidebar");
      $('.navbar-brand > span').show();
    } else {
      $("body").addClass("mini-sidebar");
      $('.navbar-brand > span').hide();
    }
  };

  AppC.toogleNavbar = function(view) {
    if ($("body").hasClass("no-sidebar")) {
      return;
    }
    $("body").toggleClass("show-sidebar");
    $(".nav-toggler i").toggleClass("mdi mdi-menu");
    $(".nav-toggler i").addClass("ti-close");
  };

  AppC.windowResized = function() {
    this.doWindowResized();
    Controller.windowResized.call(this);
  }

  AppC.doWindowResized = function() {
    if ($("body").hasClass("no-sidebar")) {
      return;
    }
    var width = (window.innerWidth > 0) ? window.innerWidth : this.screen.width;
    if (width < 1024) {
      $("body").addClass("mini-sidebar");
      $('.navbar-brand > span').hide();
    } else {
      $("body").removeClass("mini-sidebar");
      $('.navbar-brand > span').show();
    }
  }
})();
