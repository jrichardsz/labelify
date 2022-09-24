<div class="">
  <div class="form-group">
      <label for="googleImageApiUrl">Google Api Url</label>
      <input class="form-control" id="googleImageApiUrl" placeholder="https://script.google.com/macros/s/AK**8M/exec">
  </div>
  <div class="form-group">
      <label for="googleImageApiUrl">Tag</label>
      <input class="form-control" id="tag" placeholder="camera 125, video hd 1, etc">
  </div>
  <div class="form-group">
      <label for="expectedClasses">Expected clases</label>
      <input class="form-control" id="expectedClasses" placeholder="cars, pets, etc">
  </div>
  <div class="form-group">
      <label for="annotationGroupIdentifier">Annotation Group Identifier</label>
      <input class="form-control" id="annotationGroupIdentifier" placeholder="january-2022-01">
  </div>
  <div class="form-group">
    <!-- <input id="add_images_button" type="submit" value="Submit">   -->
    <button id="add_images_button"  type="button" class="btn btn-primary">Submit</button>
  </div>
</div>
<div id="success_message"  class="alert alert-success"  style="display:none" role="alert">
  <label id="success_message_text"></label>
</div>
<div id="error_message"  class="alert alert-danger"  style="display:none" role="alert">
  <label id="error_message_text"></label>
</div>
