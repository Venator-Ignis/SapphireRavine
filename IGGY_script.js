
const statToSkillsMap = {
    power: ["athletics", "intimidate", "survival"],
    agility: ["acrobatics","athletics","arts","forgery","navigation","performance","sleight","stealth",],
    qicontrol: ["history", "medicine",],
    mental: ["disguise","arts","aid","forgery","history","intuition","investigation","medicine","navigation","perception","survival",],
    appearance: ["charm","deceit","disguise","intimidate","performance","persuade",],
};

["power","agility","vitality","cult","qicontrol","mental","appearance",].forEach((attr) => {
    self.on(`change:${attr}`, function () {
    const skills = statToSkillsMap[attr];
    if (skills) {
        updateSkills(skills);
    }
    if (
        attr === "power" ||
        attr === "agility" ||
        attr === "vitality" ||
        attr === "qicontrol" ||
        attr === "mental"
    ) {
        updateAttacks("all");
        updateTool(`${attr}`);
    }
    });
});

var updateSkills = function (skillsArray) {
    var attrsToGet = ["power","agility","vitality","cult","qicontrol","mental","appearance",];
    var update = {};

    getAttrs(attrsToGet, function (values) {
    skillsArray.forEach(function (skill) {
        console.log("UPDATING SKILL: " + skill);
        var attrMod = 0;

        switch (skill) {
        case "acrobatics":attrMod = parseInt(values.agility);
            break;
        case "athletics":attrMod = Math.round((parseInt(values.power) + parseInt(values.agility)) / 2);
            break;
        case "charm":attrMod = parseInt(values.appearance);
            break;
        case "deceit":attrMod = parseInt(values.appearance);
            break;
        case "disguise":attrMod = Math.round((parseInt(values.appearance) + parseInt(values.mental)) / 2);
            break;
        case "arts":attrMod = Math.round((parseInt(values.agility) + parseInt(values.mental)) / 2);
            break;
        case "aid":attrMod = Math.round((parseInt(values.vitality) + parseInt(values.mental)) / 2);
            break;
        case "forgery":attrMod = Math.round((parseInt(values.agility) + parseInt(values.mental)) / 2);
            break;
        case "history":attrMod = Math.round((parseInt(values.qicontrol) + parseInt(values.mental)) / 2);
            break;
        case "intuition":attrMod = parseInt(values.mental);
            break;
        case "intimidate":attrMod = Math.round((parseInt(values.power) + parseInt(values.appearance)) / 2);
            break;
        case "investigation":attrMod = parseInt(values.mental);
            break;
        case "medicine":attrMod = Math.round((parseInt(values.qicontrol) + parseInt(values.mental)) / 2);
            break;
        case "navigation":attrMod = Math.round((parseInt(values.agility) + parseInt(values.mental)) / 2);
            break;
        case "perception":attrMod = parseInt(values.mental);
            break;
        case "performance":attrMod = Math.round((parseInt(values.agility) + parseInt(values.appearance)) / 2);
            break;
        case "persuade":attrMod = parseInt(values.appearance);
            break;
        case "sleight":attrMod = parseInt(values.agility);
            break;
        case "stealth":attrMod = parseInt(values.agility);
            break;
        case "survival":attrMod = Math.round((parseInt(values.power) + parseInt(values.mental)) / 2);
            break;
        // Add more skills here with their respective calculations
        }

        var total = attrMod;
        update[skill] = total;
    });

    setAttrs(update, { silent: true }, function () {
        callbacks.forEach(function (callback) {
        callback();
        });
    });
    });
};

on("change:poison", function (eventinfo) {
    let poison = toInt(eventinfo.newValue);
    let update = {};
    if (poison < 100) {
    update["poison_state_100"] = 0;
    update["poison_state_200"] = 0;
    update["poison_state_300"] = 0;
    update["poison_state_400"] = 0;
    }
    if (poison >= 100) {
    update["poison_state_100"] = 1;
    update["poison_state_200"] = 0;
    update["poison_state_300"] = 0;
    update["poison_state_400"] = 0;
    }
    if (poison >= 200) {
    update["poison_state_100"] = 1;
    update["poison_state_200"] = 1;
    update["poison_state_300"] = 0;
    update["poison_state_400"] = 0;
    }
    if (poison >= 300) {
    update["poison_state_100"] = 1;
    update["poison_state_200"] = 1;
    update["poison_state_300"] = 1;
    update["poison_state_400"] = 0;
    }
    if (poison >= 400) {
    update["poison_state_100"] = 1;
    update["poison_state_200"] = 1;
    update["poison_state_300"] = 1;
    update["poison_state_400"] = 1;
    }
    setAttrs(update);
});

let toInt = function (value) {
    return value && !isNaN(value) ? parseInt(value) : 0;
};

var updateAttacks = function(update_id){
    console.log("Updating Attacks: " + update_id);
    if (update_id.substring(0, 1) === "-" && update_id.length === 20) {
        do_update_attack([update_id]);
    } else if (["power","agility","vitality","qicontrol","mental","all"].indexOf(update_id) > -1){
        getSectionIDs("repeating_attack", function(attackarray){
            console.log("Attacks: " + attackarray);
            do_update_attack(attackarray);
        });
    };
};

var do_update_attack = function(attack_array){
    var attack_attr = ["power","agility","vitality","qicontrol","mental"];
    _.each(attack_array, function(attack_id){
        attack_attr.push("repeating_attack_" + attack_id + "_atkflag");
        attack_attr.push("repeating_attack_" + attack_id + "_atkname");
        attack_attr.push("repeating_attack_" + attack_id + "_atkattr_base");
        attack_attr.push("repeating_attack_" + attack_id + "_atkmod");
        attack_attr.push("repeating_attack_" + attack_id + "_atkrange");
        attack_attr.push("repeating_attack_" + attack_id + "_atk_desc");
        attack_attr.push("repeating_attack_" + attack_id + "_dmgflag");
        attack_attr.push("repeating_attack_" + attack_id + "_dmgbase");
        attack_attr.push("repeating_attack_" + attack_id + "_dmgattr");
        attack_attr.push("repeating_attack_" + attack_id + "_dmgmod");
        attack_attr.push("repeating_attack_" + attack_id + "_dmgtype");
        attack_attr.push("repeating_attack_" + attack_id + "_dmg2flag");
        attack_attr.push("repeating_attack_" + attack_id + "_dmg2base");
        attack_attr.push("repeating_attack_" + attack_id + "_dmg2attr");
        attack_attr.push("repeating_attack_" + attack_id + "_dmg2type");
    });
    getAttrs(attack_attr, function(v){
        _.each(attack_array, function(attack_id){
            var callbacks = [];
            var update = {};
            var dmg = "";
            var dmgattr = "";
            var dmg2 = "";
            var dmg2attr = "";
            var hbonus = "";
            var hdmg1 = "";
            var hdmg2 = "";
            var atkattr_abrev = "";
            var dmgattr_abrev = "";
            var dmg2attr_abrev = "";

            if (!v["repeating_attack_" + attack_id + "_atkattr_base"] || v["repeating_attack_" + attack_id + "_atkattr_base"] === "0") {
                atkattr_base = 0
            } else {
                atkattr_base = parseInt(v[v["repeating_attack_" + attack_id + "_atkattr_base"].substring(2, v["repeating_attack_" + attack_id + "_atkattr_base"].length - 1)], 10);
                atkattr_abrev = v["repeating_attack_" + attack_id + "_atkattr_base"].substring(2, 5).toUpperCase();
            };

            if (!v["repeating_attack_" + attack_id + "_dmgattr"] || v["repeating_attack_" + attack_id + "_dmgattr"] === "0") {
                dmgattr = 0;
            } else {
                dmgattr = parseInt(v[v["repeating_attack_" + attack_id + "_dmgattr"].substring(2, v["repeating_attack_" + attack_id + "_dmgattr"].length - 1)], 10);
                dmgattr_abrev = v["repeating_attack_" + attack_id + "_dmgattr"].substring(2, 5).toUpperCase();
            };

            if (!v["repeating_attack_" + attack_id + "_dmg2attr"] || v["repeating_attack_" + attack_id + "_dmg2attr"] === "0") {
                dmg2attr = 0;
            } else {
                dmg2attr = parseInt(v[v["repeating_attack_" + attack_id + "_dmg2attr"].substring(2, v["repeating_attack_" + attack_id + "_dmg2attr"].length - 1)], 10);
                dmg2attr_abrev = v["repeating_attack_" + attack_id + "_dmg2attr"].substring(2, 5).toUpperCase();
            };

            var dmgbase = v["repeating_attack_" + attack_id + "_dmgbase"] && v["repeating_attack_" + attack_id + "_dmgbase"] != "" ? v["repeating_attack_" + attack_id + "_dmgbase"] : 0;
            var dmg2base = v["repeating_attack_" + attack_id + "_dmg2base"] && v["repeating_attack_" + attack_id + "_dmg2base"] != "" ? v["repeating_attack_" + attack_id + "_dmg2base"] : 0;
            var dmgmod = v["repeating_attack_" + attack_id + "_dmgmod"] && isNaN(parseInt(v["repeating_attack_" + attack_id + "_dmgmod"], 10)) === false ? parseInt(v["repeating_attack_" + attack_id + "_dmgmod"], 10) : 0;
            var dmg2mod = v["repeating_attack_" + attack_id + "_dmg2mod"] && isNaN(parseInt(v["repeating_attack_" + attack_id + "_dmg2mod"], 10)) === false ? parseInt(v["repeating_attack_" + attack_id + "_dmg2mod"], 10) : 0;
            var dmgtype = v["repeating_attack_" + attack_id + "_dmgtype"] ? v["repeating_attack_" + attack_id + "_dmgtype"] + " " : "";
            var dmg2type = v["repeating_attack_" + attack_id + "_dmg2type"] ? v["repeating_attack_" + attack_id + "_dmg2type"] + " " : "";
            var atkmod = v["repeating_attack_" + attack_id + "_atkmod"] && v["repeating_attack_" + attack_id + "_atkmod"] != "" ? parseInt(v["repeating_attack_" + attack_id + "_atkmod"], 10) : 0;

            if (v["repeating_attack_" + attack_id + "_atkflag"] && v["repeating_attack_" + attack_id + "_atkflag"] != 0) {
                bonus = atkattr_base + atkmod;
            } else {
                bonus = "-";
            }
            if (v["repeating_attack_" + attack_id + "_dmgflag"] && v["repeating_attack_" + attack_id + "_dmgflag"] != 0) {
                if (dmgbase === 0 && (dmgattr + dmgmod === 0)) {
                    dmg = 0;
                }
                if (dmgbase != 0) {
                    dmg = dmgbase;
                }
                if (dmgbase != 0 && (dmgattr + dmgmod != 0)) {
                    dmg = dmgattr + dmgmod > 0 ? dmg + "+" : dmg;
                }
                if (dmgattr + dmgmod != 0) {
                    dmg = dmg + (dmgattr + dmgmod);
                }
                dmg = dmg + " " + dmgtype;
            } else {
                dmg = "";
            };
            if (v["repeating_attack_" + attack_id + "_dmg2flag"] && v["repeating_attack_" + attack_id + "_dmg2flag"] != 0) {
                if (dmg2base === 0 && (dmg2attr + dmg2mod === 0)) {
                    dmg2 = 0;
                }
                if (dmg2base != 0) {
                    dmg2 = dmg2base;
                }
                if (dmg2base != 0 && (dmg2attr + dmg2mod != 0)) {
                    dmg2 = dmg2attr + dmg2mod > 0 ? dmg2 + "+" : dmg2;
                }
                if (dmg2attr + dmg2mod != 0) {
                    dmg2 = dmg2 + (dmg2attr + dmg2mod);
                }
                dmg2 = dmg2 + " " + dmg2type;
            } else {
                dmg2 = "";
            };

            dmgspacer = v["repeating_attack_" + attack_id + "_dmgflag"] && v["repeating_attack_" + attack_id + "_dmgflag"] != 0 && v["repeating_attack_" + attack_id + "_dmg2flag"] && v["repeating_attack_" + attack_id + "_dmg2flag"] != 0 ? "+ " : "";

            if (v["repeating_attack_" + attack_id + "_atkflag"] && v["repeating_attack_" + attack_id + "_atkflag"] != 0) {
                if (atkmod != 0) {
                    hbonus = atkmod + " [MOD]" + hbonus
                };
                if (atkattr_base != 0) {
                    hbonus = atkattr_base + " [" + atkattr_abrev + "]" + hbonus
                };
            } else {
                hbonus = "";
            }
            if (v["repeating_attack_" + attack_id + "_dmgflag"] && v["repeating_attack_" + attack_id + "_dmgflag"] != 0) {
                if (dmgmod != 0) {
                    hdmg1 = dmgmod + " [MOD]" + hdmg1
                };
                if (dmgattr != 0) {
                    hdmg1 = " + " + dmgattr + " [" + dmgattr_abrev + "]" + hdmg1
                };
                hdmg1 = dmgbase + hdmg1;
            } else {
                hdmg1 = "0";
            }
            if (v["repeating_attack_" + attack_id + "_dmg2flag"] && v["repeating_attack_" + attack_id + "_dmg2flag"] != 0) {
                if (dmg2mod != 0) {
                    hdmg2 = " + " + dmg2mod + " [MOD]" + hdmg2
                };
                if (dmg2attr != 0) {
                    hdmg2 = " + " + dmg2attr + " [" + dmg2attr_abrev + "]" + hdmg2
                };
                hdmg2 = dmg2base + hdmg2;
            } else {
                hdmg2 = "0";
            }

            if (v["repeating_attack_" + attack_id + "_atkflag"] && v["repeating_attack_" + attack_id + "_atkflag"] != 0) {
                pickbase = "pick";
                rollbase = "&{template:atk} {{rname=[@{atkname}](~repeating_attack_attack_damage)}} {{r1=[["+hbonus+"]]}} {{r2=[["+hbonus+"]]}} {{range=@{atkrange}}} {{desc=@{atk_desc}}} {{charname=@{character_name}}}";
            } else if (v["repeating_attack_" + attack_id + "_dmgflag"] && v["repeating_attack_" + attack_id + "_dmgflag"] != 0) {
                pickbase = "dmg";
                rollbase = "&{template:dmg} {{rname=@{atkname}}} {{range=@{atkrange}}} @{dmgflag} {{dmg1=[[" + hdmg1 + "]]}} {{dmg1type=" + dmgtype + "}} @{dmg2flag} {{dmg2=[[" + hdmg2 + "]]}} {{dmg2type=" + dmg2type + "}} {{desc=@{atk_desc}}} {{charname=@{character_name}}}"
            } else {
                pickbase = "empty";
                rollbase = "&{template:dmg} {{rname=@{atkname}}} {{range=@{atkrange}}} {{desc=@{atk_desc}}} {{charname=@{character_name}}}"
            }

            update["repeating_attack_" + attack_id + "_rollbase_damage"] = "&{template:dmg} {{rname=@{atkname}}} {{range=@{atkrange}}} @{dmgflag} {{dmg1=[[" + hdmg1 + "]]}} {{dmg1type=" + dmgtype + "}} @{dmg2flag} {{dmg2=[[" + hdmg2 + "]]}} {{dmg2type=" + dmg2type + "}} {{desc=@{atk_desc}}} {{charname=@{character_name}}}";
            update["repeating_attack_" + attack_id + "_atkbonus"] = bonus;
            update["repeating_attack_" + attack_id + "_atkdmgtype"] = dmg + dmgspacer + dmg2 + " ";
            update["repeating_attack_" + attack_id + "_rollbase"] = rollbase;

            setAttrs(update, {
                silent: true
            }, function() {
                callbacks.forEach(function(callback) {
                    callback();
                })
            });

        });
    });
};

on("change:repeating_attack:atkname change:repeating_attack:atkflag change:repeating_attack:atkattr_base change:repeating_attack:atkmod change:repeating_attack:dmgflag change:repeating_attack:dmgbase change:repeating_attack:dmgattr change:repeating_attack:dmgmod change:repeating_attack:dmgtype change:repeating_attack:dmg2flag change:repeating_attack:dmg2base change:repeating_attack:dmg2attr change:repeating_attack:dmg2mod change:repeating_attack:dmg2type change:repeating_attack:atkrange", function() {
    updateAttacks("all");
});

on("change:repeating_tool:toolname change:repeating_tool:toolattr_base change:repeating_tool:tool_mod", function(eventinfo) {
    if (eventinfo.sourceType === "sheetworker") {
        return;
    }
    var tool_id = eventinfo.sourceAttribute.substring(15, 35);
    updateTool(tool_id);
});

var updateTool = function(tool_id) {
    if (tool_id.substring(0, 1) === "-" && tool_id.length === 20) {
        do_update_tool([tool_id]);
    } else if (tool_id === "all") {
        getSectionIDs("repeating_tool", function(idarray) {
            do_update_tool(idarray);
        });
    } else {
        getSectionIDs("repeating_tool", function(idarray) {
            var tool_attribs = [];
            _.each(idarray, function(id) {
                tool_attribs.push("repeating_tool_" + id + "_toolattr_base");
            });
            getAttrs(tool_attribs, function(v) {
                var attr_tool_ids = [];
                _.each(idarray, function(id) {
                    if (v["repeating_tool_" + id + "_toolattr_base"] && v["repeating_tool_" + id + "_toolattr_base"].indexOf(tool_id) > -1) {
                        attr_tool_ids.push(id);
                    }
                });
                if (attr_tool_ids.length > 0) {
                    do_update_tool(attr_tool_ids);
                }
            });
        });
    };
};

var do_update_tool = function(tool_array) {
    var tool_attribs = ["power","agility","vitality","qicontrol","mental"];
    var update = {};
    _.each(tool_array, function(tool_id) {
        tool_attribs.push("repeating_tool_" + tool_id + "_tool_mod");
        tool_attribs.push("repeating_tool_" + tool_id + "_toolattr_base");
    });

    getAttrs(tool_attribs, function(v) {
        _.each(tool_array, function(tool_id) {
            console.log("UPDATING TOOL: " + tool_id);
            var query = false;
            if (v["repeating_tool_" + tool_id + "_toolattr_base"] && v["repeating_tool_" + tool_id + "_toolattr_base"].substring(0, 2) === "?{") {
                update["repeating_tool_" + tool_id + "_toolattr"] = "QUERY";
                var mod = "?{Attribute?|Power,@{power}|Agility,@{agility}|Vitality,@{vitality}|Qi Control,@{qicontrol}|Mental Strength,@{mental}}";
                if (v["repeating_tool_" + tool_id + "_tool_mod"]) {
                    mod = mod + "+" + v["repeating_tool_" + tool_id + "_tool_mod"];
                }
                query = true;
            } else {
                var attr = v["repeating_tool_" + tool_id + "_toolattr_base"].substring(0, v["repeating_tool_" + tool_id + "_toolattr_base"].length - 1).substr(2);
                var attr_mod = v[attr] ? parseInt(v[attr], 10) : 0;
                var tool_mod = v["repeating_tool_" + tool_id + "_tool_mod"] && !isNaN(parseInt(v["repeating_tool_" + tool_id + "_tool_mod"], 10)) ? parseInt(v["repeating_tool_" + tool_id + "_tool_mod"], 10) : 0;
                var mod = attr_mod + tool_mod;
                update["repeating_tool_" + tool_id + "_toolattr"] = attr.toUpperCase();
                if (!v["repeating_tool_" + tool_id + "_tool_mod"]) {
                    update["repeating_tool_" + tool_id + "_tool_mod"] = 0;
                }
            };
            update["repeating_tool_" + tool_id + "_toolbonus"] = mod;
            update["repeating_tool_" + tool_id + "_toolbonus_display"] = mod;
        });

        setAttrs(update, {
            silent: true
        });
    });
};
