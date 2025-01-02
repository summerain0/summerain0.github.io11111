const example = `<vector xmlns:android="http://schemas.android.com/apk/res/android"
    android:width="24dp"
    android:height="24dp"
    android:tint="#000000"
    android:viewportWidth="24"
    android:viewportHeight="24">

    <path
        android:fillColor="@android:color/white"
        android:pathData="M12,4m-2,0a2,2 0,1 1,4 0a2,2 0,1 1,-4 0" />

    <path
        android:fillColor="@android:color/white"
        android:pathData="M15.89,8.11C15.5,7.72 14.83,7 13.53,7c-0.21,0 -1.42,0 -2.54,0C8.24,6.99 6,4.75 6,2H4c0,3.16 2.11,5.84 5,6.71V22h2v-6h2v6h2V10.05L18.95,14l1.41,-1.41L15.89,8.11z" />

</vector>`
const template = `val %iconName1%: ImageVector
    get() {
        if (_%iconName2% != null) {
            return _%iconName2%!!
        }
        _%iconName2% = ImageVector.Builder(
            name = "%iconName1%",
            defaultWidth = %defaultWidth%.dp,
            defaultHeight = %defaultHeight%.dp,
            viewportWidth = %viewportWidth%f,
            viewportHeight = %viewportHeight%f,
            autoMirror = false
        )%result%.build()
        return _%iconName2%!!
    }

private var _%iconName2%: ImageVector? = null`
const textPadding = "                "

const iconNameField = document.getElementById("iconNameField")
const rawTextarea = document.getElementById("rawText")
const targetTextarea = document.getElementById("targetText")
const conversionButton = document.getElementById("conversionBtn")
const clearButton = document.getElementById("clearBtn")
const copyButton = document.getElementById("copyBtn")
const exegesisSwitch = document.getElementById("exegesisSwitch")

window.onload = function () {
    rawTextarea.value = example
}

conversionButton.onclick = function () {
    const rawText = rawTextarea.value.trim()
    if (rawText.length === 0) {
        mdui.snackbar({
            message: '请输入文本'
        });
        return
    }
    const parser = new DOMParser()
    let doc = parser.parseFromString(rawText, "application/xml");
    // 检查合法性
    if (doc.querySelector('html') !== null) {
        mdui.snackbar({
            message: '待处理文本不合法！'
        });
        return
    }
    // 检查画布大小
    const vector = doc.querySelector('vector')
    const viewportWidth = vector.attributes['android:viewportWidth'].value
    const viewportHeight = vector.attributes['android:viewportHeight'].value
    const defaultWidth = vector.attributes['android:width'].value.replaceAll("dp", "")
    const defaultHeight = vector.attributes['android:height'].value.replaceAll("dp", "")
    const paths = vector.querySelectorAll('path')
    let result = ""
    paths.forEach(function (path) {
        const pathData = path.attributes['android:pathData'].value
        if (pathData === null) {
            mdui.snackbar({
                message: '没获取到pathData！'
            });
            return
        }
        let patchText = `.path(
            fill = SolidColor(Color.Black),
            fillAlpha = 1f,
            stroke = null,
            strokeAlpha = 1f,
            strokeLineWidth = 1f,
            strokeLineCap = StrokeCap.Butt,
            strokeLineJoin = StrokeJoin.Bevel,
            strokeLineMiter = 1f,
            pathFillType = PathFillType.NonZero
        ) {\n`
        const commands = parseSVGPath(pathData)
        patchText += convertToPathBuilder(commands)
        patchText += "        }"
        result += patchText
    })
    // icon名字
    const iconName1 = iconNameField.value
    if (iconName1.trim().length === 0) {
        mdui.snackbar({
            message: '请输入图标名称！'
        });
        return
    }
    const iconName2 = iconName1.substring(0, 1).toLowerCase() + iconName1.substring(1, iconName1.length)
    // path内容
    targetTextarea.value = template
        .replace("%result%", result)
        .replaceAll("%iconName1%", iconName1)
        .replaceAll("%iconName2%", iconName2)
        .replaceAll("%defaultWidth%", defaultWidth)
        .replaceAll("%defaultHeight%", defaultHeight)
        .replaceAll("%viewportWidth%", viewportWidth)
        .replaceAll("%viewportHeight%", viewportHeight)
}

clearButton.onclick = function () {
    rawTextarea.value = ""
    targetTextarea.value = ""
}

copyButton.onclick = function () {
    navigator.clipboard.writeText(targetTextarea.value.trim()).then(
        () => {
            mdui.snackbar({
                message: '复制成功'
            });
        },
        () => {
            mdui.snackbar({
                message: '复制失败'
            });
        }
    );
}

function parseSVGPath(pathString) {
    let commands = [];
    let currentCommand = '';

    for (let i = 0; i < pathString.length; i++) {
        let char = pathString[i];

        if (char.match(/[a-zA-Z]/)) { // 如果遇到字母，则当前操作结束，将当前操作及其参数保存到数组中
            if (currentCommand !== '') {
                commands.push(currentCommand.split(' '));
            }
            currentCommand = char;
        } else if (char.match(/[0-9.-]/)) { // 如果是数字或减号，则将其添加到当前操作的参数中
            let startIndex = i;
            while (i + 1 < pathString.length && pathString[i + 1].match(/[0-9.-]/)) {
                i++;
            }
            let parameter = pathString.substring(startIndex, i + 1);
            currentCommand += ' ' + parameter;
        }
    }

    // 将最后一个操作及其参数添加到数组中
    if (currentCommand !== '') {
        commands.push(currentCommand.split(' '));
    }

    return commands;
}

// 根据操作符生成文本
function convertToPathBuilder(commands) {
    let pathBuilder = "";
    for (let i = 0; i < commands.length; i++) {
        let command = commands[i][0];
        let params = commands[i].slice(1).map(Number);

        switch (command) {
            case "M":
                pathBuilder += `${textPadding}moveTo(${params[0]}f, ${params[1]}f)\n`;
                break;
            case "m":
                pathBuilder += `${textPadding}moveToRelative(${params[0]}f, ${params[1]}f)\n`;
                break;

            case "L":
                // 参数可能包含多个，所以需要循环绘制多条线段
                for (let index = 0; index < params.length; index += 2) {
                    pathBuilder += `${textPadding}lineTo(${params[index]}f, ${params[index + 1]}f)\n`;
                }
                break;
            case "l":
                // 参数可能包含多个，所以需要循环绘制多条线段
                for (let index = 0; index < params.length; index += 2) {
                    pathBuilder += `${textPadding}lineToRelative(${params[index]}f, ${params[index + 1]}f)\n`;
                }
                break;

            case "H":
                pathBuilder += `${textPadding}horizontalLineTo(${params[0]}f)\n`;
                break;
            case "h":
                pathBuilder += `${textPadding}horizontalLineToRelative(${params[0]}f)\n`;
                break;

            case "V":
                pathBuilder += `${textPadding}verticalLineTo(${params[0]}f)\n`;
                break;
            case "v":
                pathBuilder += `${textPadding}verticalLineToRelative(${params[0]}f)\n`;
                break;

            case "C":
                // 参数可能包含多个，所以需要循环绘制多条线段
                for (let index = 0; index < params.length; index += 6) {
                    pathBuilder += `${textPadding}curveTo(${params[index]}f, ${params[index + 1]}f, ${params[index + 2]}f, ${params[index + 3]}f, ${params[index + 4]}f, ${params[index + 5]}f)\n`;
                }
                break;
            case "c":
                for (let index = 0; index < params.length; index += 6) {
                    pathBuilder += `${textPadding}curveToRelative(${params[index]}f, ${params[index + 1]}f, ${params[index + 2]}f, ${params[index + 3]}f, ${params[index + 4]}f, ${params[index + 5]}f)\n`;
                }
                break;

            case "A":
                pathBuilder += `${textPadding}arcTo(${params[0]}f, ${params[1]}f, ${params[2]}f, ${params[3] == '1'}, ${params[4] == '1'}, ${params[5]}f, ${params[6]}f)\n`;
                break;
            case "a":
                pathBuilder += `${textPadding}arcToRelative(${params[0]}f, ${params[1]}f, ${params[2]}f, ${params[3] == '1'}, ${params[4] == '1'}, ${params[5]}f, ${params[6]}f)\n`;
                break;

            case "S":
                pathBuilder += `${textPadding}reflectiveCurveTo(${params[0]}f, ${params[1]}f, ${params[2]}f, ${params[3]}f)\n`;
                break;
            case "s":
                pathBuilder += `${textPadding}reflectiveCurveToRelative(${params[0]}f, ${params[1]}f, ${params[2]}f, ${params[3]}f)\n`;
                break;

            case "Z":
            case "z":
                pathBuilder += textPadding + "close()\n";
                break;

            default:
                pathBuilder += `${textPadding}[未知的操作符${command}]${params}\n`
                break;
        }
    }
    return pathBuilder;
}