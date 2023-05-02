import * as S from "@chakra-ui/react";
import useDogProfileImage from "../hooks/useDogProfileImage";
import { FaRegCopy } from "react-icons/fa";

type ProfileProps = {
  username: string;
  userId: string;
};

const Profile = ({ username, userId }: ProfileProps) => {
  const profile_img = useDogProfileImage() as string;
  const { isOpen, onOpen, onClose } = S.useDisclosure();
  const toast = S.useToast();
  const bgColor = S.useColorModeValue("white", "gray.800");
  const borderColor = S.useColorModeValue("gray.200", "gray.700");
  const margin = S.useColorModeValue("2", "4");
  const textColor = S.useColorModeValue("gray.600", "gray.400");

  const { onCopy, hasCopied } = S.useClipboard(userId);

  const handleImageClick = () => {
    onOpen();
  };

  return (
    <>
      <S.Flex p={4} alignItems={"center"} flexDirection={"row"} gap={3}>
        <S.Tooltip label={userId} placement="top">
            <div style={{ position: "relative" }}>
              {!profile_img ? (
                <S.Spinner />
              ) : (
                <S.Image
                  src={profile_img}
                  alt="Profile Picture"
                  borderRadius="full"
                  boxSize="80px"
                  onClick={handleImageClick}
                  cursor="pointer"
                  _hover={{ opacity: "0.8" }}
                />
              )}
            </div>
        </S.Tooltip>
        <S.Text fontSize="md" color={textColor} mb={margin}>
          ID: {userId}
        </S.Text>
        <S.Button
          size="md"
          onClick={() => {
            onCopy;
            toast({
              title: "Copiado com sucoesso",
              status: "success",
              isClosable: true,
            });
          }}
        >
          <FaRegCopy />
        </S.Button>
      </S.Flex>

      <S.Modal isOpen={isOpen} onClose={onClose}>
        <S.ModalOverlay />
        <S.ModalContent bgColor={bgColor}>
          <S.ModalHeader>Profile</S.ModalHeader>
          <S.ModalCloseButton />
          <S.ModalBody>
            <S.Flex flexDirection="column" gap={4} textAlign="center">
              <S.Image
                src={profile_img}
                alt="Profile Picture"
                borderRadius="full"
                boxSize="80px"
                width={250}
                height={250}
                margin="0 auto"
                _hover={{ opacity: "0.8" }}
              />
              <S.Heading>{username}</S.Heading>
              <S.Text fontSize="md" color={textColor} mb={margin}>
                ID: {userId}
              </S.Text>
              <S.Button
                size="sm"
                onClick={() => {
                  onCopy;
                  toast({
                    title: "Copiado com sucoesso",
                    status: "success",
                    isClosable: true,
                  });
                }}
              >
                <FaRegCopy />
              </S.Button>
            </S.Flex>
          </S.ModalBody>
        </S.ModalContent>
      </S.Modal>
    </>
  );
};

export default Profile;
