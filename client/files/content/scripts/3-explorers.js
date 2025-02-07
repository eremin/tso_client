addMenuItem(loca.GetText("SPE", "Explorer") + " (F3)", menuExplorersHandler, 114);

function menuExplorersHandler(event)
{
	$( "div[role='dialog']:not(#specModal):visible").modal("hide");
	createModalWindow('specModal', '');
	$("#specModal .modal-title").html(getImageTag('icon_explorer.png')+' '+loca.GetText("SPE", "Explorer"));
	if(swmmo.application.mGameInterface.isOnHomzone() == false) {
		showGameAlert(getText('not_home'));
		return;
	}
	if($('#specModal .specSaveTemplate').length == 0)
	{
		createSpecWindow();
	}
    out = '<div class="container-fluid">';
	isThereAnySpec = false;
	swmmo.application.mGameInterface.mCurrentPlayerZone.GetSpecialists_vector().sort(0).forEach(function(item){
	  if(item.GetBaseType() == 1) {
		  if (item.GetTask() != null) { return; }
		  isThereAnySpec = true;
		  art = bean = false;
		  item.getSkillTree().getItems_vector().forEach(function(skill){
			if(skill.getLevel() > 0) { 
				if (skill.getId() == 39) { art = true; }
				if (skill.getId() == 40) { bean = true; }
			}
		  });
		  out += createTableRow([
			[4, getImageTag(item.getIconID(), '10%') + item.getName(false), 'name'],
			[3, '&nbsp;'],
			[5, createExplorerDropdown(item.GetUniqueID(), art, bean)]
		  ]);
	  }
	});
	out = out + '</div>';
	if(!isThereAnySpec){
		showGameAlert(getText('no_free_expl'));
		return;
	}
	$("#specModal .massSend").html(createExplorerDropdown(null, true, true, true));
	$("#specModalData").html(out);
	$( "#expl-mass" ).change(massChangeSpecDropdown);
	$('#specModalData .container-fluid').selectable({
		filter: ".name",
		selecting: function(e, ui) {
			var curr = $(ui.selecting.tagName, e.target).index(ui.selecting);
			if(e.shiftKey && prev > -1) {
				$(ui.selecting.tagName, e.target).slice(Math.min(prev, curr), 1 + Math.max(prev, curr)).filter(".name").addClass('ui-selected');
				prev = -1;
			} else {
				prev = curr;
			}
		}
	});
	$('#specModalData select[id!="expl-mass"]').change(multiSelectSpec);
    $('#specModal:not(:visible)').modal({backdrop: "static"});
}

function createExplorerDropdown(id, art, bean, mass)
{
	if(mass) { id = 'mass';	} else { id = id.uniqueID1 + '_' + id.uniqueID2; }	
	select = $('<select>', { id: 'expl-'+id }).attr('class', 'form-control');
	select.append($('<option>', { value: '0' }).text(loca.GetText("LAB", "Cancel")).prop("outerHTML"));
	treasureGroup = $('<optgroup>', { label: loca.GetText("LAB", "FindTreasure") });
	treasureGroup.append($('<option>', { value: '1,0' }).text(loca.GetText("LAB", "FindTreasureShort")).prop("outerHTML"));
	treasureGroup.append($('<option>', { value: '1,1' }).text(loca.GetText("LAB", "FindTreasureMedium")).prop("outerHTML"));
	treasureGroup.append($('<option>', { value: '1,2' }).text(loca.GetText("LAB", "FindTreasureLong")).prop("outerHTML"));
	treasureGroup.append($('<option>', { value: '1,3' }).text(loca.GetText("LAB", "FindTreasureEvenLonger")).prop("outerHTML"));
	if(swmmo.application.mGameInterface.mHomePlayer.GetPlayerLevel() >= 54 || mass) {
	  treasureGroup.append($('<option>', { value: '1,6' }).text(loca.GetText("LAB", "FindTreasureLongest")).prop("outerHTML"));
	}
	if(art) { treasureGroup.append($('<option>', { value: '1,4' }).text(loca.GetText("LAB", "FindTreasureTravellingErudite")).prop("outerHTML")); }
	if(bean) { treasureGroup.append($('<option>', { value: '1,5' }).text(loca.GetText("LAB", "FindTreasureBeanACollada")).prop("outerHTML")); }
	select.append(treasureGroup.prop("outerHTML"));
	adventureGroup = $('<optgroup>', { label: loca.GetText("LAB", "SpecialistTaskFindAdventureZone") });
	adventureGroup.append($('<option>', { value: '2,0' }).text(loca.GetText("LAB", "FindAdventureZoneShort")).prop("outerHTML"));
	adventureGroup.append($('<option>', { value: '2,1' }).text(loca.GetText("LAB", "FindAdventureZoneMedium")).prop("outerHTML"));
	adventureGroup.append($('<option>', { value: '2,2' }).text(loca.GetText("LAB", "FindAdventureZoneLong")).prop("outerHTML"));
	adventureGroup.append($('<option>', { value: '2,3' }).text(loca.GetText("LAB", "FindAdventureZoneVeryLong")).prop("outerHTML"));
	select.append(adventureGroup.prop("outerHTML"));
	return select.prop("outerHTML");
}